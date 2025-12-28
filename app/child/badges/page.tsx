'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Trophy, Sparkles, Star } from 'lucide-react';
import {
  getSelectedChildId,
  getSelectedChild,
  getCurrentChildLatestResult,
  getCurrentChildBadges,
  getCurrentChildPoints,
  Badge,
} from '@/lib/utils/child-storage';

// 모든 배지 목록 (획득 가능한 배지들)
const ALL_BADGES = [
  {
    id: 'learner',
    emoji: '🏅',
    title: '배움의 달인',
    description: '새로운 것을 배웠어요!',
    category: '학습',
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'friend',
    emoji: '💫',
    title: '친절한 친구',
    description: '친구에게 친절했어요!',
    category: '사회',
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 'athlete',
    emoji: '🏃',
    title: '운동왕',
    description: '운동을 열심히 했어요!',
    category: '운동',
    color: 'from-green-400 to-emerald-400',
  },
  {
    id: 'writer',
    emoji: '✍️',
    title: '글쓰기 달인',
    description: '일기를 7일 연속 썼어요!',
    category: '창작',
    color: 'from-purple-400 to-violet-400',
  },
  {
    id: 'explorer',
    emoji: '🔭',
    title: '호기심 탐험가',
    description: '새로운 취미를 시작했어요!',
    category: '탐구',
    color: 'from-orange-400 to-amber-400',
  },
  {
    id: 'helper',
    emoji: '🤲',
    title: '도움이',
    description: '다른 사람을 도와줬어요!',
    category: '봉사',
    color: 'from-teal-400 to-cyan-400',
  },
  {
    id: 'reader',
    emoji: '📚',
    title: '책벌레',
    description: '책을 많이 읽었어요!',
    category: '학습',
    color: 'from-indigo-400 to-blue-400',
  },
  {
    id: 'artist',
    emoji: '🎨',
    title: '꼬마 예술가',
    description: '멋진 작품을 만들었어요!',
    category: '창작',
    color: 'from-fuchsia-400 to-pink-400',
  },
  {
    id: 'musician',
    emoji: '🎵',
    title: '음악 천재',
    description: '음악 활동을 열심히 했어요!',
    category: '예술',
    color: 'from-violet-400 to-purple-400',
  },
  {
    id: 'scientist',
    emoji: '🔬',
    title: '꼬마 과학자',
    description: '실험이나 탐구를 했어요!',
    category: '탐구',
    color: 'from-lime-400 to-green-400',
  },
  {
    id: 'streak-7',
    emoji: '🔥',
    title: '7일 연속',
    description: '7일 연속 체크인했어요!',
    category: '성실',
    color: 'from-red-400 to-orange-400',
  },
  {
    id: 'first-mission',
    emoji: '⭐',
    title: '첫 미션 완료',
    description: '첫 번째 미션을 완료했어요!',
    category: '도전',
    color: 'from-yellow-400 to-amber-400',
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

export default function ChildBadgesPage() {
  const router = useRouter();
  const [childName, setChildName] = useState('친구');
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState<(typeof ALL_BADGES)[0] | null>(null);

  useEffect(() => {
    const id = getSelectedChildId();
    if (!id) {
      router.push('/');
      return;
    }

    const child = getSelectedChild();
    if (child?.nickname) {
      setChildName(child.nickname);
    } else {
      const result = getCurrentChildLatestResult();
      if (result?.basicInfo?.nickname) {
        setChildName(result.basicInfo.nickname);
      }
    }
    setEarnedBadges(getCurrentChildBadges());
    setTotalPoints(getCurrentChildPoints());
  }, [router]);

  const isEarned = (badgeId: string) => earnedBadges.some(b => b.id === badgeId);
  const getEarnedDate = (badgeId: string) => {
    const badge = earnedBadges.find(b => b.id === badgeId);
    return badge?.earnedAt ? formatDate(badge.earnedAt) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/child">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">내 배지</h1>
        </div>

        {/* 요약 카드 */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🏆</div>
            <h2 className="text-2xl font-bold text-gray-800">{childName}의 배지</h2>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500">{earnedBadges.length}</div>
              <div className="text-sm text-gray-500">모은 배지</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500">{totalPoints}</div>
              <div className="text-sm text-gray-500">총 포인트</div>
            </div>
          </div>

          {earnedBadges.length === 0 && (
            <div className="mt-4 text-center text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
              <Sparkles className="w-4 h-4 inline mr-1" />
              미션을 완료하면 배지를 얻을 수 있어요!
            </div>
          )}
        </div>

        {/* 획득한 배지 섹션 */}
        {earnedBadges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              획득한 배지
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {earnedBadges.map(badge => {
                const badgeInfo = ALL_BADGES.find(b => b.id === badge.id);
                if (!badgeInfo) return null;

                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badgeInfo)}
                    className={`bg-gradient-to-br ${badgeInfo.color} rounded-2xl p-4 text-center shadow-lg hover:scale-105 transition-all`}
                  >
                    <div className="text-4xl mb-1">{badgeInfo.emoji}</div>
                    <div className="text-xs font-medium text-white truncate">
                      {badgeInfo.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 모든 배지 섹션 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            모든 배지
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {ALL_BADGES.map(badge => {
              const earned = isEarned(badge.id);
              const earnedDate = getEarnedDate(badge.id);

              return (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className={`relative rounded-2xl p-4 text-center transition-all ${
                    earned
                      ? `bg-gradient-to-br ${badge.color} shadow-lg hover:scale-105`
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {!earned && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80 rounded-2xl">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className={`text-4xl mb-1 ${!earned && 'opacity-30 grayscale'}`}>
                    {badge.emoji}
                  </div>
                  <div className={`text-xs font-medium truncate ${earned ? 'text-white' : 'text-gray-400'}`}>
                    {badge.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 배지 상세 모달 */}
        {selectedBadge && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 ${
                isEarned(selectedBadge.id)
                  ? `bg-gradient-to-br ${selectedBadge.color}`
                  : 'bg-gray-200'
              }`}>
                {isEarned(selectedBadge.id) ? selectedBadge.emoji : <Lock className="w-10 h-10 text-gray-400" />}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {selectedBadge.title}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                isEarned(selectedBadge.id)
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {selectedBadge.category}
              </span>

              <p className="text-gray-600 mb-4">{selectedBadge.description}</p>

              {isEarned(selectedBadge.id) ? (
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-sm text-green-600 font-medium">
                    ✅ {getEarnedDate(selectedBadge.id)}에 획득!
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-sm text-gray-500">
                    🎯 미션을 완료하면 얻을 수 있어요!
                  </p>
                </div>
              )}

              <Button
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-4 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500"
              >
                닫기
              </Button>
            </div>
          </div>
        )}

        {/* 하단 응원 메시지 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
            미션을 완료하고 배지를 모아봐!
          </p>
        </div>
      </div>
    </div>
  );
}
