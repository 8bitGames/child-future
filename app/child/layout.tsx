'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getChildSession, clearChildSession } from '@/lib/utils/family-auth';
import { getSelectedChildId } from '@/lib/utils/child-storage';

interface ChildLayoutProps {
  children: React.ReactNode;
}

export default function ChildLayout({ children }: ChildLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // 방법 1: Supabase 기반 세션 확인
      const session = getChildSession();

      if (session) {
        // 세션이 있으면 서버에서 유효성 검증
        try {
          const response = await fetch(`/api/auth/child/session?token=${session.sessionToken}`);
          const data = await response.json();

          if (data.valid) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          } else {
            // 세션이 만료되었으면 정리
            clearChildSession();
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          clearChildSession();
        }
      }

      // 방법 2: localStorage 기반 아이 선택 확인 (레거시 지원)
      const selectedChildId = getSelectedChildId();
      if (selectedChildId) {
        setIsAuthenticated(true);
        setIsChecking(false);
        return;
      }

      // 인증 안됨 - 로그인 페이지로 리다이렉트
      setIsAuthenticated(false);
      setIsChecking(false);
    };

    checkAuthentication();
  }, [pathname]);

  // 로딩 중
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-yellow-50 to-green-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🚀</div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증 안됨
  if (!isAuthenticated) {
    router.push('/auth/child-login');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-yellow-50 to-green-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <p className="text-gray-600">로그인 페이지로 이동 중...</p>
        </div>
      </div>
    );
  }

  // 인증됨 - 자식 컴포넌트 렌더링
  return <>{children}</>;
}
