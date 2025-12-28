'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Star, Sparkles } from 'lucide-react';
import {
  getSelectedChildId,
  getSelectedChild,
  getCurrentChildLatestResult,
  getCurrentChildCheckIns,
  addChildCheckIn,
  addChildPoints,
  getChildTodayCheckIn,
  CheckIn,
} from '@/lib/utils/child-storage';

// 기분 이모지 목록
const MOOD_OPTIONS = [
  { emoji: '😆', label: '최고!', value: 'great', color: 'from-yellow-300 to-orange-300', points: 10 },
  { emoji: '😊', label: '좋아', value: 'good', color: 'from-green-300 to-emerald-300', points: 10 },
  { emoji: '😐', label: '그냥', value: 'okay', color: 'from-gray-300 to-slate-300', points: 10 },
  { emoji: '😢', label: '슬퍼', value: 'sad', color: 'from-blue-300 to-indigo-300', points: 10 },
  { emoji: '😤', label: '화나', value: 'angry', color: 'from-red-300 to-rose-300', points: 10 },
];

// 활동 이모지 목록
const ACTIVITY_OPTIONS = [
  { emoji: '📚', label: '공부', value: 'study' },
  { emoji: '🎮', label: '게임', value: 'game' },
  { emoji: '⚽', label: '운동', value: 'sports' },
  { emoji: '🎨', label: '그림', value: 'art' },
  { emoji: '🎵', label: '음악', value: 'music' },
  { emoji: '📖', label: '책', value: 'reading' },
  { emoji: '👫', label: '친구', value: 'friends' },
  { emoji: '👨‍👩‍👧', label: '가족', value: 'family' },
];

export default function ChildCheckInPage() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState('친구');
  const [step, setStep] = useState<'mood' | 'activity' | 'done'>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [memo, setMemo] = useState('');
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

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

    const todayCheckIn = getChildTodayCheckIn(id);
    if (todayCheckIn) {
      setAlreadyCheckedIn(true);
      setSelectedMood(todayCheckIn.mood || null);
      setSelectedActivities(todayCheckIn.activities || []);
      setMemo(todayCheckIn.memo || '');
      setStep('done');
    }
  }, [router]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleNext = () => {
    if (step === 'mood' && selectedMood) {
      setStep('activity');
    }
  };

  const handleSubmit = () => {
    if (!selectedMood || !childId) return;

    const moodOption = MOOD_OPTIONS.find(m => m.value === selectedMood);
    const points = (moodOption?.points || 10) + (selectedActivities.length * 2);

    const checkIn: CheckIn = {
      id: Date.now().toString(),
      mood: selectedMood,
      activities: selectedActivities,
      memo,
      createdAt: new Date().toISOString(),
      points,
    };

    addChildCheckIn(childId, checkIn);
    addChildPoints(childId, points);
    setEarnedPoints(points);
    setStep('done');
  };

  // 이미 체크인한 경우
  if (alreadyCheckedIn && step === 'done') {
    const moodOption = MOOD_OPTIONS.find(m => m.value === selectedMood);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-md mx-auto px-4 py-6">
          {/* 헤더 */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/child">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">오늘 기분 체크</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">{moodOption?.emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              오늘 이미 체크했어요!
            </h2>
            <p className="text-gray-500 mb-6">내일 다시 와줘! 💪</p>

            {selectedActivities.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">오늘 한 활동:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedActivities.map(activity => {
                    const activityOption = ACTIVITY_OPTIONS.find(a => a.value === activity);
                    return (
                      <span key={activity} className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                        {activityOption?.emoji} {activityOption?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <Link href="/child">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 완료 화면
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-pink-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="animate-bounce mb-4">
              <div className="text-8xl">🎉</div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              잘했어, {childName}!
            </h2>
            <p className="text-gray-600 mb-4">오늘 기분 체크 완료!</p>

            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 w-full max-w-xs">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-orange-500">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                +{earnedPoints} 포인트
              </div>
              <p className="text-sm text-gray-500 mt-2">포인트를 얻었어!</p>
            </div>

            <Link href="/child" className="w-full max-w-xs">
              <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                <Sparkles className="w-5 h-5 mr-2" />
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/child">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">오늘 기분 체크</h1>
        </div>

        {/* 진행 표시 */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-2 rounded-full ${step === 'mood' || step === 'activity' ? 'bg-pink-400' : 'bg-gray-200'}`}></div>
          <div className={`flex-1 h-2 rounded-full ${step === 'activity' ? 'bg-pink-400' : 'bg-gray-200'}`}></div>
        </div>

        {/* Step 1: 기분 선택 */}
        {step === 'mood' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {childName}, 오늘 기분이 어때?
              </h2>
              <p className="text-gray-500">하나를 골라봐!</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`relative p-4 rounded-2xl transition-all ${
                    selectedMood === mood.value
                      ? `bg-gradient-to-br ${mood.color} scale-110 shadow-lg ring-4 ring-white`
                      : 'bg-white hover:scale-105 shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-1">{mood.emoji}</div>
                  <div className={`text-xs font-medium ${selectedMood === mood.value ? 'text-white' : 'text-gray-600'}`}>
                    {mood.label}
                  </div>
                  {selectedMood === mood.value && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!selectedMood}
              className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
            >
              다음으로! →
            </Button>
          </div>
        )}

        {/* Step 2: 활동 선택 */}
        {step === 'activity' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                오늘 뭐 했어?
              </h2>
              <p className="text-gray-500">여러 개 골라도 돼!</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {ACTIVITY_OPTIONS.map(activity => (
                <button
                  key={activity.value}
                  onClick={() => handleActivityToggle(activity.value)}
                  className={`relative p-4 rounded-2xl transition-all ${
                    selectedActivities.includes(activity.value)
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400 scale-105 shadow-lg'
                      : 'bg-white hover:scale-105 shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-1">{activity.emoji}</div>
                  <div className={`text-xs font-medium ${selectedActivities.includes(activity.value) ? 'text-white' : 'text-gray-600'}`}>
                    {activity.label}
                  </div>
                  {selectedActivities.includes(activity.value) && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-blue-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 간단 메모 (선택) */}
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                오늘 있었던 일 (안 써도 돼!)
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="재미있었던 일이 있어?"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-0 resize-none text-base"
                rows={2}
                maxLength={100}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('mood')}
                className="flex-1 py-6 text-lg rounded-2xl"
              >
                ← 뒤로
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 py-6 text-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                완료! ✓
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
