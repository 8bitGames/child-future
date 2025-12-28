import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidFamilyCode, parseFamilyCode } from '@/lib/utils/family-auth';
import type { Family, Child } from '@/lib/supabase/database.types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { familyCode } = body;

    // Validate and normalize family code
    const normalizedCode = parseFamilyCode(familyCode || '');

    if (!isValidFamilyCode(normalizedCode)) {
      return NextResponse.json(
        {
          success: false,
          error: '올바른 가족 코드를 입력해주세요.'
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find family by code
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('id, name')
      .eq('family_code', normalizedCode)
      .single();

    const family = familyData as Pick<Family, 'id' | 'name'> | null;

    if (familyError || !family) {
      return NextResponse.json(
        {
          success: false,
          error: '가족을 찾을 수 없습니다. 코드를 확인해주세요.'
        },
        { status: 404 }
      );
    }

    // Get children in this family (only those with PIN set)
    const { data: childrenData, error: childrenError } = await supabase
      .from('children')
      .select('id, nickname, avatar_url, pin_hash')
      .eq('family_id', family.id)
      .order('created_at', { ascending: true });

    const children = childrenData as Pick<Child, 'id' | 'nickname' | 'avatar_url' | 'pin_hash'>[] | null;

    if (childrenError) {
      console.error('Children fetch error:', childrenError);
      return NextResponse.json(
        {
          success: false,
          error: '아이 목록을 불러오는데 실패했습니다.'
        },
        { status: 500 }
      );
    }

    // Filter children with PIN set
    const childrenWithPin = (children || [])
      .filter(child => child.pin_hash)
      .map(child => ({
        id: child.id,
        nickname: child.nickname,
        avatar: child.avatar_url || '🧒'
      }));

    if (childrenWithPin.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '로그인할 수 있는 아이가 없습니다. 부모님에게 PIN을 설정해달라고 요청하세요.'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      family: {
        id: family.id,
        name: family.name,
        children: childrenWithPin
      }
    });
  } catch (error) {
    console.error('Family lookup API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '서버 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}
