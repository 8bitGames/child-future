import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import {
  isValidFamilyCode,
  isValidPin,
  parseFamilyCode,
  generateSessionToken,
  getSessionExpiry,
  isAccountLocked
} from '@/lib/utils/family-auth';
import { MAX_PIN_ATTEMPTS, PIN_LOCKOUT_MINUTES } from '@/lib/types/family';
import type { Family, Child, ChildSession } from '@/lib/supabase/database.types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { familyCode, childId, pin, deviceFingerprint } = body;

    // Validate inputs
    const normalizedCode = parseFamilyCode(familyCode || '');

    if (!isValidFamilyCode(normalizedCode)) {
      return NextResponse.json({
        success: false,
        error: '올바른 가족 코드를 입력해주세요.'
      }, { status: 400 });
    }

    if (!childId) {
      return NextResponse.json({
        success: false,
        error: '아이를 선택해주세요.'
      }, { status: 400 });
    }

    if (!isValidPin(pin)) {
      return NextResponse.json({
        success: false,
        error: 'PIN은 4자리 숫자입니다.'
      }, { status: 400 });
    }

    const supabase = await createClient();

    // Find family
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('id')
      .eq('family_code', normalizedCode)
      .single();

    const family = familyData as Pick<Family, 'id'> | null;

    if (familyError || !family) {
      return NextResponse.json({
        success: false,
        error: '가족을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // Get child
    const { data: childData, error: childError } = await supabase
      .from('children')
      .select('id, nickname, age, avatar_url, family_id, pin_hash, pin_attempts, pin_locked_until')
      .eq('id', childId)
      .single();

    const child = childData as Pick<Child, 'id' | 'nickname' | 'age' | 'avatar_url' | 'family_id' | 'pin_hash' | 'pin_attempts' | 'pin_locked_until'> | null;

    if (childError || !child) {
      return NextResponse.json({
        success: false,
        error: '아이를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // Verify child belongs to this family
    if (child.family_id !== family.id) {
      return NextResponse.json({
        success: false,
        error: '잘못된 접근입니다.'
      }, { status: 403 });
    }

    // Check if PIN is set
    if (!child.pin_hash) {
      return NextResponse.json({
        success: false,
        error: 'PIN이 설정되지 않았습니다. 부모님에게 요청하세요.'
      }, { status: 400 });
    }

    // Check if account is locked
    if (isAccountLocked(child.pin_locked_until)) {
      const lockEnd = new Date(child.pin_locked_until!);
      const minutesRemaining = Math.ceil((lockEnd.getTime() - Date.now()) / (1000 * 60));

      return NextResponse.json({
        success: false,
        error: `너무 많이 틀렸어요. ${minutesRemaining}분 후에 다시 시도해주세요.`,
        lockoutUntil: child.pin_locked_until
      }, { status: 429 });
    }

    // Verify PIN
    const pinValid = await bcrypt.compare(pin, child.pin_hash);

    if (!pinValid) {
      const newAttempts = (child.pin_attempts || 0) + 1;
      const attemptsRemaining = MAX_PIN_ATTEMPTS - newAttempts;

      // Lock account if too many attempts
      if (newAttempts >= MAX_PIN_ATTEMPTS) {
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + PIN_LOCKOUT_MINUTES);

        await (supabase
          .from('children') as any)
          .update({
            pin_attempts: newAttempts,
            pin_locked_until: lockUntil.toISOString()
          })
          .eq('id', childId);

        return NextResponse.json({
          success: false,
          error: `PIN이 ${MAX_PIN_ATTEMPTS}번 틀렸습니다. ${PIN_LOCKOUT_MINUTES}분 후에 다시 시도해주세요.`,
          lockoutUntil: lockUntil.toISOString()
        }, { status: 429 });
      }

      // Update attempt count
      await (supabase
        .from('children') as any)
        .update({ pin_attempts: newAttempts })
        .eq('id', childId);

      return NextResponse.json({
        success: false,
        error: `PIN이 틀렸습니다. ${attemptsRemaining}번 더 시도할 수 있어요.`,
        attemptsRemaining
      }, { status: 401 });
    }

    // PIN is correct - reset attempts and create session
    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiry();

    // Create session
    const { data: sessionData, error: sessionError } = await (supabase
      .from('child_sessions') as any)
      .insert({
        child_id: childId,
        family_id: family.id,
        session_token: sessionToken,
        device_fingerprint: deviceFingerprint || null,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    const session = sessionData as ChildSession | null;

    if (sessionError || !session) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json({
        success: false,
        error: '로그인에 실패했습니다. 다시 시도해주세요.'
      }, { status: 500 });
    }

    // Update child: reset attempts, set last login
    await (supabase
      .from('children') as any)
      .update({
        pin_attempts: 0,
        pin_locked_until: null,
        last_login_at: new Date().toISOString()
      })
      .eq('id', childId);

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        childId: session.child_id,
        familyId: session.family_id,
        sessionToken: session.session_token,
        expiresAt: session.expires_at,
        createdAt: session.created_at,
        lastActiveAt: session.last_active_at
      },
      child: {
        id: child.id,
        nickname: child.nickname,
        age: child.age,
        avatar: child.avatar_url || '🧒',
        pinSet: true,
        lastLoginAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Child login API error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
