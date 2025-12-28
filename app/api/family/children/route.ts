import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Family, Child } from '@/lib/supabase/database.types';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Get user's family
    const { data: familyData } = await supabase
      .from('families')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const family = familyData as Pick<Family, 'id'> | null;

    if (!family) {
      return NextResponse.json({ children: [] });
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
      return NextResponse.json({ error: '아이 목록을 불러오는데 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
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
    console.error('Children GET API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { nickname, age, avatar } = body;

    if (!nickname || nickname.trim().length === 0) {
      return NextResponse.json({ error: '아이 이름을 입력해주세요.' }, { status: 400 });
    }

    if (!age || age < 1 || age > 20) {
      return NextResponse.json({ error: '올바른 나이를 입력해주세요.' }, { status: 400 });
    }

    // Get user's family
    const { data: familyData } = await supabase
      .from('families')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const family = familyData as Pick<Family, 'id'> | null;

    if (!family) {
      return NextResponse.json({ error: '먼저 가족을 생성해주세요.' }, { status: 400 });
    }

    // Create child
    const { data: childData, error: createError } = await (supabase
      .from('children') as any)
      .insert({
        user_id: user.id,
        family_id: family.id,
        nickname: nickname.trim(),
        age: age,
        avatar_url: avatar || '🧒',
        activities: [],
        hobbies: [],
        interests: [],
        strong_subjects: [],
        achievements: [],
        likes: [],
        dream_jobs: [],
        dislikes: []
      })
      .select()
      .single();

    const child = childData as Child | null;

    if (createError || !child) {
      console.error('Child creation error:', createError);
      return NextResponse.json({ error: '아이 등록에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      child: {
        id: child.id,
        nickname: child.nickname,
        age: child.age,
        avatar: child.avatar_url || '🧒',
        pinSet: false,
        lastLoginAt: null
      }
    });
  } catch (error) {
    console.error('Children POST API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
