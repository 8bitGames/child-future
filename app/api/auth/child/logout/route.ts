import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createClient();

    // Delete session
    await supabase
      .from('child_sessions')
      .delete()
      .eq('session_token', sessionToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Child logout API error:', error);
    return NextResponse.json({ success: true }); // Always succeed on logout
  }
}
