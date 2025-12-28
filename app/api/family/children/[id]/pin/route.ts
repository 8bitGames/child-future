import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { isValidPin, isWeakPin } from '@/lib/utils/family-auth';
import type { Family, Child } from '@/lib/supabase/database.types';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: childId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { pin } = body;

    // Validate PIN
    if (!isValidPin(pin)) {
      return NextResponse.json(
        { error: 'PIN은 4자리 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (isWeakPin(pin)) {
      return NextResponse.json(
        { error: '너무 쉬운 PIN입니다. 다른 PIN을 설정해주세요.' },
        { status: 400 }
      );
    }

    // Verify ownership: check if child belongs to user's family
    const { data: familyData } = await supabase
      .from('families')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const family = familyData as Pick<Family, 'id'> | null;

    if (!family) {
      return NextResponse.json({ error: '가족을 찾을 수 없습니다.' }, { status: 404 });
    }

    const { data: childData } = await supabase
      .from('children')
      .select('id, family_id')
      .eq('id', childId)
      .single();

    const child = childData as Pick<Child, 'id' | 'family_id'> | null;

    if (!child || child.family_id !== family.id) {
      return NextResponse.json({ error: '아이를 찾을 수 없습니다.' }, { status: 404 });
    }

    // Hash PIN with bcrypt
    const pinHash = await bcrypt.hash(pin, 10);

    // Update child with PIN hash
    const { error: updateError } = await (supabase
      .from('children') as any)
      .update({
        pin_hash: pinHash,
        pin_attempts: 0,
        pin_locked_until: null
      })
      .eq('id', childId);

    if (updateError) {
      console.error('PIN update error:', updateError);
      return NextResponse.json({ error: 'PIN 설정에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PIN API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: childId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Verify ownership
    const { data: familyData } = await supabase
      .from('families')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    const family = familyData as Pick<Family, 'id'> | null;

    if (!family) {
      return NextResponse.json({ error: '가족을 찾을 수 없습니다.' }, { status: 404 });
    }

    const { data: childData } = await supabase
      .from('children')
      .select('id, family_id')
      .eq('id', childId)
      .single();

    const child = childData as Pick<Child, 'id' | 'family_id'> | null;

    if (!child || child.family_id !== family.id) {
      return NextResponse.json({ error: '아이를 찾을 수 없습니다.' }, { status: 404 });
    }

    // Remove PIN
    const { error: updateError } = await (supabase
      .from('children') as any)
      .update({
        pin_hash: null,
        pin_attempts: 0,
        pin_locked_until: null
      })
      .eq('id', childId);

    if (updateError) {
      console.error('PIN delete error:', updateError);
      return NextResponse.json({ error: 'PIN 삭제에 실패했습니다.' }, { status: 500 });
    }

    // Also delete any active sessions for this child
    await supabase
      .from('child_sessions')
      .delete()
      .eq('child_id', childId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PIN DELETE API error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
