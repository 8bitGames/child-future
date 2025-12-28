import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음 경로 제외:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico
     * - 공개 페이지들
     * - auth/* (인증 관련 페이지)
     * - child/* (아이 페이지 - 자체 세션 관리)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|api|child|$|basic-info|consultation|assessment|results|parent-info|situation-questions).*)',
  ],
};
