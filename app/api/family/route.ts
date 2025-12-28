import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Family, Child } from '@/lib/supabase/database.types';

export async function GET() {
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

    // Get user's family
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    const family = familyData as Family | null;

    if (familyError || !family) {
      return NextResponse.json(
        { family: null },
        { status: 200 }
      );
    }

    // Get children in this family
    const { data: childrenData, error: childrenError } = await supabase
      .from('children')
      .select('id, nickname, age, avatar_url, pin_hash, last_login_at, created_at')
      .eq('family_id', family.id)
      .order('created_at', { ascending: true });

    const children = childrenData as Pick<Child, 'id' | 'nickname' | 'age' | 'avatar_url' | 'pin_hash' | 'last_login_at' | 'created_at'>[] | null;

    if (childrenError) {
      console.error('Children fetch error:', childrenError);
    }

    return NextResponse.json({
      family: {
        id: family.id,
        familyCode: family.family_code,
        name: family.name,
        createdAt: family.created_at
      },
      children: (children || []).map(child => ({
        id: child.id,
        nickname: child.nickname,
        age: child.age,
        avatar: child.avatar_url || '🧒',
        pinSet: !!child.pin_hash,
        lastLoginAt: child.last_login_at
      }))
    });
  } catch (error) {
    console.error('Family GET API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
