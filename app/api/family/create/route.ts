import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateFamilyCode } from '@/lib/utils/family-auth';
import type { Family } from '@/lib/supabase/database.types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '가족 이름을 입력해주세요.' },
        { status: 400 }
      );
    }

    // Check if user already has a family
    const { data: existingFamilyData } = await supabase
      .from('families')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const existingFamily = existingFamilyData as Pick<Family, 'id'> | null;

    if (existingFamily) {
      return NextResponse.json(
        { error: '이미 가족이 생성되어 있습니다.' },
        { status: 400 }
      );
    }

    // Generate unique family code
    let familyCode = generateFamilyCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const { data: existingCodeData } = await supabase
        .from('families')
        .select('id')
        .eq('family_code', familyCode)
        .single();

      const existing = existingCodeData as Pick<Family, 'id'> | null;
      if (!existing) break;

      familyCode = generateFamilyCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: '가족 코드 생성에 실패했습니다. 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // Create family
    const { data: familyData, error: createError } = await (supabase
      .from('families') as any)
      .insert({
        family_code: familyCode,
        owner_id: user.id,
        name: name.trim()
      })
      .select()
      .single();

    const family = familyData as Family | null;

    if (createError || !family) {
      console.error('Family creation error:', createError);
      return NextResponse.json(
        { error: '가족 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      family: {
        id: family.id,
        familyCode: family.family_code,
        name: family.name,
        createdAt: family.created_at
      }
    });
  } catch (error) {
    console.error('Family create API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
