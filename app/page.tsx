'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getUserMode, setUserMode, getLatestResult } from '@/lib/utils/storage';
import { Users, Baby, Sparkles, Heart, Target, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [childName, setChildName] = useState<string | null>(null);

  useEffect(() => {
    // 이미 모드가 선택되어 있으면 해당 페이지로 이동
    const mode = getUserMode();
    const latestResult = getLatestResult();

    if (latestResult) {
      setChildName(latestResult.basicInfo.nickname);
    }

    if (mode === 'parent') {
      router.push('/parent');
      return;
    } else if (mode === 'child') {
      router.push('/child');
      return;
    }

    setIsLoading(false);
  }, [router]);

  const handleModeSelect = (mode: 'parent' | 'child') => {
    setUserMode(mode);
    router.push(`/${mode}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* 로고 및 타이틀 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            우아미
          </h1>
          <p className="text-lg text-gray-600">
            아이의 미래를 함께 그려요
          </p>
          {childName && (
            <p className="mt-2 text-sm text-indigo-600 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              {childName}님의 성장 기록이 있습니다
            </p>
          )}
        </div>

        {/* 모드 선택 카드 */}
        <div className="space-y-4">
          {/* 부모 모드 */}
          <button
            onClick={() => handleModeSelect('parent')}
            className="w-full group"
          >
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-indigo-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    부모님 모드
                    <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                  </h2>
                  <p className="text-sm text-gray-500">
                    진로 검사, 성장 분석, 목표 관리
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full">진로 검사</span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">AI 분석</span>
                <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full">성장 리포트</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">목표 관리</span>
              </div>
            </div>
          </button>

          {/* 아이 모드 */}
          <button
            onClick={() => handleModeSelect('child')}
            className="w-full group"
          >
            <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-300 hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Baby className="w-8 h-8 text-orange-500" />
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    어린이 모드
                    <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </h2>
                  <p className="text-sm text-gray-500">
                    미션 도전, 일기 쓰기, 배지 모으기
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded-full">🎯 미션</span>
                <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full">📝 일기</span>
                <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">🏅 배지</span>
                <span className="text-xs px-2 py-1 bg-pink-50 text-pink-600 rounded-full">😊 기분</span>
              </div>
            </div>
          </button>
        </div>

        {/* 하단 정보 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-pink-400" />
            아이의 성장을 함께 응원합니다
          </p>
        </div>
      </div>
    </div>
  );
}
