'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Trophy, Sparkles, Check, Lock } from 'lucide-react';
import {
  getSelectedChildId,
  getSelectedChild,
  getCurrentChildLatestResult,
  getCurrentChildMissions,
  saveChildMissions,
  addChildBadge,
  addChildPoints,
  getCurrentChildPoints,
  Mission,
} from '@/lib/utils/child-storage';

// 기본 미션 목록
const DEFAULT_MISSIONS: Mission[] = [
  // 일일 미션
  {
    id: 'daily-1',
    title: '오늘 기분 체크하기',
    description: '오늘 내 기분을 체크해봐!',
    emoji: '😊',
    category: 'daily',
    points: 10,
  },
  {
    id: 'daily-2',
    title: '책 10분 읽기',
    description: '좋아하는 책을 10분 읽어봐!',
    emoji: '📚',
    category: 'daily',
    points: 15,
  },
  {
    id: 'daily-3',
    title: '감사한 것 말하기',
    description: '오늘 고마웠던 것을 가족에게 말해봐!',
    emoji: '💝',
    category: 'daily',
    points: 10,
  },
  // 주간 미션
  {
    id: 'weekly-1',
    title: '새로운 것 배우기',
    description: '이번 주에 새로운 것 하나를 배워봐!',
    emoji: '🎓',
    category: 'weekly',
    points: 30,
    badgeId: 'learner',
    badgeEmoji: '🏅',
  },
  {
    id: 'weekly-2',
    title: '친구에게 친절하기',
    description: '친구에게 좋은 일을 해줘봐!',
    emoji: '🤝',
    category: 'weekly',
    points: 25,
    badgeId: 'friend',
    badgeEmoji: '💫',
  },
  {
    id: 'weekly-3',
    title: '운동 3번 하기',
    description: '이번 주에 운동을 3번 해봐!',
    emoji: '⚽',
    category: 'weekly',
    points: 35,
    badgeId: 'athlete',
    badgeEmoji: '🏃',
  },
  // 챌린지 미션
  {
    id: 'challenge-1',
    title: '일기 7일 연속 쓰기',
    description: '7일 동안 매일 일기를 써봐!',
    emoji: '📝',
    category: 'challenge',
    points: 100,
    badgeId: 'writer',
    badgeEmoji: '✍️',
  },
  {
    id: 'challenge-2',
    title: '새로운 취미 시작하기',
    description: '해본 적 없는 새로운 취미를 시작해봐!',
    emoji: '🎨',
    category: 'challenge',
    points: 80,
    badgeId: 'explorer',
    badgeEmoji: '🔭',
  },
];

export function ChildMissionsClient() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState('친구');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'daily' | 'weekly' | 'challenge'>('all');
  const [showReward, setShowReward] = useState<{ points: number; badge?: string } | null>(null);

  useEffect(() => {
    const id = getSelectedChildId();
    if (!id) {
      router.push('/');
      return;
    }
    setChildId(id);

    const child = getSelectedChild();
    if (child?.nickname) {
      setChildName(child.nickname);
    } else {
      const result = getCurrentChildLatestResult();
      if (result?.basicInfo?.nickname) {
        setChildName(result.basicInfo.nickname);
      }
    }

    // 미션 로드 (없으면 기본 미션으로 초기화)
    let loadedMissions = getCurrentChildMissions();
    if (loadedMissions.length === 0) {
      saveChildMissions(id, DEFAULT_MISSIONS);
      loadedMissions = DEFAULT_MISSIONS;
    }
    setMissions(loadedMissions);
  }, [router]);

  const handleCompleteMission = (missionId: string) => {
    if (!childId) return;

    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.completedAt) return;

    const updatedMissions = missions.map(m =>
      m.id === missionId ? { ...m, completedAt: new Date().toISOString() } : m
    );

    saveChildMissions(childId, updatedMissions);
    setMissions(updatedMissions);
    addChildPoints(childId, mission.points);

    if (mission.badgeId && mission.badgeEmoji) {
      addChildBadge(childId, {
        id: mission.badgeId,
        emoji: mission.badgeEmoji,
        title: mission.title,
      });
    }

    setShowReward({
      points: mission.points,
      badge: mission.badgeEmoji,
    });

    setTimeout(() => setShowReward(null), 2500);
  };

  const filteredMissions = selectedCategory === 'all'
    ? missions
    : missions.filter(m => m.category === selectedCategory);

  const completedCount = missions.filter(m => m.completedAt).length;
  const totalPoints = missions.filter(m => m.completedAt).reduce((acc, m) => acc + m.points, 0);

  const CATEGORY_OPTIONS = [
    { value: 'all', label: '전체', emoji: '🎯' },
    { value: 'daily', label: '오늘', emoji: '☀️' },
    { value: 'weekly', label: '이번주', emoji: '📅' },
    { value: 'challenge', label: '챌린지', emoji: '🏆' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-yellow-50 to-amber-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/child">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">미션</h1>
        </div>

        {/* 진행 현황 */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">{completedCount}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                완료한 미션
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{totalPoints}</div>
              <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                <Star className="w-3 h-3" />
                얻은 포인트
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORY_OPTIONS.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-orange-100'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 미션 목록 */}
        <div className="space-y-3">
          {filteredMissions.map(mission => (
            <div
              key={mission.id}
              className={`bg-white rounded-2xl p-4 shadow-md transition-all ${
                mission.completedAt ? 'opacity-75' : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                  mission.completedAt
                    ? 'bg-green-100'
                    : mission.category === 'daily'
                    ? 'bg-yellow-100'
                    : mission.category === 'weekly'
                    ? 'bg-blue-100'
                    : 'bg-purple-100'
                }`}>
                  {mission.completedAt ? '✅' : mission.emoji}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold ${mission.completedAt ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {mission.title}
                    </h3>
                    {mission.badgeEmoji && (
                      <span className="text-lg" title="배지 획득 가능!">
                        {mission.badgeEmoji}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{mission.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-orange-500">+{mission.points}</span>
                    </div>

                    {mission.completedAt ? (
                      <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                        <Check className="w-4 h-4" /> 완료!
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteMission(mission.id)}
                        className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                      >
                        완료했어요!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 리워드 팝업 */}
        {showReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce shadow-2xl max-w-xs mx-4">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">미션 완료!</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-xl">
                  <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-orange-500">+{showReward.points} 포인트</span>
                </div>

                {showReward.badge && (
                  <div className="flex items-center justify-center gap-2 text-xl">
                    <Trophy className="w-8 h-8 text-purple-500" />
                    <span className="font-bold text-purple-500">새 배지 {showReward.badge}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 하단 응원 메시지 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            {childName}, 미션을 완료하고 배지를 모아봐!
          </p>
        </div>
      </div>
    </div>
  );
}
