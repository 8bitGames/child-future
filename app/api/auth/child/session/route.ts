import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ChildSession, Child } from '@/lib/supabase/database.types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get('token');
    const childId = searchParams.get('childId');

    if (!sessionToken && !childId) {
      return NextResponse.json({
        valid: false,
        error: '세션 정보가 필요합니다.'
      }, { status: 400 });
    }

    const supabase = await createClient();

    // Find session - build query based on provided params
    let sessionData: ChildSession | null = null;
    let sessionError: Error | null = null;

    if (sessionToken) {
      const result = await supabase
        .from('child_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      sessionData = result.data as ChildSession | null;
      sessionError = result.error;
    } else if (childId) {
      const result = await supabase
        .from('child_sessions')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      sessionData = result.data as ChildSession | null;
      sessionError = result.error;
    }

    const session = sessionData;

    if (sessionError || !session) {
      return NextResponse.json({
        valid: false,
        error: '세션을 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Delete expired session
      await supabase
        .from('child_sessions')
        .delete()
        .eq('id', session.id);

      return NextResponse.json({
        valid: false,
        error: '세션이 만료되었습니다.'
      }, { status: 401 });
    }

    // Get child info
    const { data: childData, error: childError } = await supabase
      .from('children')
      .select('id, nickname, age, avatar_url, pin_hash, last_login_at')
      .eq('id', session.child_id)
      .single();

    const child = childData as Pick<Child, 'id' | 'nickname' | 'age' | 'avatar_url' | 'pin_hash' | 'last_login_at'> | null;

    if (childError || !child) {
      return NextResponse.json({
        valid: false,
        error: '아이 정보를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // Update last active
    await (supabase
      .from('child_sessions') as any)
      .update({ last_active_at: new Date().toISOString() })
      .eq('id', session.id);

    return NextResponse.json({
      valid: true,
      session: {
        id: session.id,
        childId: session.child_id,
        familyId: session.family_id,
        sessionToken: session.session_token,
        expiresAt: session.expires_at,
        createdAt: session.created_at,
        lastActiveAt: new Date().toISOString()
      },
      child: {
        id: child.id,
        nickname: child.nickname,
        age: child.age,
        avatar: child.avatar_url || '🧒',
        pinSet: !!child.pin_hash,
        lastLoginAt: child.last_login_at
      }
    });
  } catch (error) {
    console.error('Child session API error:', error);
    return NextResponse.json({
      valid: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}
