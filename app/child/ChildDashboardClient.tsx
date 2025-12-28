'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { clearUserMode } from '@/lib/utils/storage';
import { AssessmentResult } from '@/lib/types/result';
import {
  Smile, Target, BookOpen, Award, Star,
  ArrowRight, Sparkles, LogOut, Baby
} from 'lucide-react';
import {
  getSelectedChildId,
  getSelectedChild,
  getCurrentChildLatestResult,
  getCurrentChildMissions,
  getCurrentChildBadges,
  getCurrentChildPoints,
  getChildTodayCheckIn,
} from '@/lib/utils/child-storage';

export function ChildDashboardClient() {
  const router = useRouter();
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [missionStats, setMissionStats] = useState({ completed: 0, points: 0, badges: 0 });
  const [todayCheckIn, setTodayCheckIn] = useState<boolean>(false);

  useEffect(() => {
    const childId = getSelectedChildId();
    if (!childId) {
      // 선택된 아이가 없으면 메인으로
      router.push('/');
      return;
    }

    setLatestResult(getCurrentChildLatestResult());

    // 미션 통계 계산
    const missions = getCurrentChildMissions();
    const completed = missions.filter(m => m.completedAt).length;
    const points = getCurrentChildPoints();
    const badges = getCurrentChildBadges().length;
    setMissionStats({ completed, points, badges });

    // 오늘 체크인 여부
    setTodayCheckIn(!!getChildTodayCheckIn(childId));
  }, [router]);

  const handleSwitchMode = () => {
    clearUserMode();
    router.push('/');
  };

  const childName = latestResult?.basicInfo?.nickname || '친구';

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-green-50">
      <div className="max-w-md mx-auto px-4 py-6">

        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                안녕, {childName}!
              </h1>
              <p className="text-sm text-gray-500">오늘도 즐거운 하루 보내자!</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSwitchMode} className="text-gray-400">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* 포인트 & 배지 현황 */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{missionStats.points}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                포인트
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{missionStats.badges}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-green-400" />
                배지
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{missionStats.completed}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-blue-400" />
                미션 완료
              </div>
            </div>
          </div>
        </div>

        {/* 메인 메뉴 버튼들 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 오늘 기분 체크인 */}
          <Link href="/child/check-in" className="block">
            <div className={`relative bg-gradient-to-br ${todayCheckIn ? 'from-green-100 to-emerald-100 border-green-200' : 'from-pink-100 to-rose-100 border-pink-200'} rounded-2xl p-5 border-2 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]`}>
              {todayCheckIn && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              <div className="text-4xl mb-2">😊</div>
              <div className="font-bold text-gray-800 text-lg">오늘 기분</div>
              <div className="text-xs text-gray-500 mt-1">
                {todayCheckIn ? '체크 완료!' : '어떤 하루였어?'}
              </div>
            </div>
          </Link>

          {/* 미션 하러가기 */}
          <Link href="/child/missions" className="block">
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl p-5 border-2 border-orange-200 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-gray-800 text-lg">미션</div>
              <div className="text-xs text-gray-500 mt-1">재미있는 도전!</div>
            </div>
          </Link>

          {/* 일기 쓰기 */}
          <Link href="/child/diary" className="block">
            <div className="bg-gradient-to-br from-purple-100 to-violet-100 rounded-2xl p-5 border-2 border-purple-200 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="text-4xl mb-2">📝</div>
              <div className="font-bold text-gray-800 text-lg">일기</div>
              <div className="text-xs text-gray-500 mt-1">오늘 있었던 일</div>
            </div>
          </Link>

          {/* 내 배지 */}
          <Link href="/child/badges" className="block">
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-5 border-2 border-blue-200 hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="text-4xl mb-2">🏅</div>
              <div className="font-bold text-gray-800 text-lg">내 배지</div>
              <div className="text-xs text-gray-500 mt-1">{missionStats.badges}개 모았어!</div>
            </div>
          </Link>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            최근 활동
          </h2>

          {missionStats.completed > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <span className="text-xl">🌟</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">미션을 완료했어요!</p>
                  <p className="text-xs text-gray-500">+10 포인트 획득</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-sm text-gray-500">
                아직 활동 기록이 없어요
              </p>
              <p className="text-xs text-gray-400 mt-1">
                미션을 완료하고 배지를 모아보자!
              </p>
            </div>
          )}
        </div>

        {/* 응원 메시지 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <span className="text-lg">💪</span>
            {childName}, 오늘도 파이팅!
          </p>
        </div>
      </div>
    </div>
  );
}
