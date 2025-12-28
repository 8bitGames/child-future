'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Star, BookOpen, Calendar, Sparkles } from 'lucide-react';
import {
  getSelectedChildId,
  getSelectedChild,
  getCurrentChildLatestResult,
  getCurrentChildDiary,
  addChildDiaryEntry,
  addChildPoints,
  DiaryEntry,
} from '@/lib/utils/child-storage';

// 오늘의 기분 이모지
const MOOD_EMOJIS = [
  { emoji: '😆', label: '최고', value: 'great' },
  { emoji: '😊', label: '좋아', value: 'good' },
  { emoji: '😐', label: '그냥', value: 'okay' },
  { emoji: '😢', label: '슬퍼', value: 'sad' },
  { emoji: '😤', label: '화나', value: 'angry' },
];

// 날씨 이모지
const WEATHER_EMOJIS = [
  { emoji: '☀️', label: '맑음', value: 'sunny' },
  { emoji: '⛅', label: '구름', value: 'cloudy' },
  { emoji: '🌧️', label: '비', value: 'rainy' },
  { emoji: '❄️', label: '눈', value: 'snowy' },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];
  return `${month}월 ${day}일 (${weekDay})`;
}

export function ChildDiaryClient() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState('친구');
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [showReward, setShowReward] = useState(false);

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
    setEntries(getCurrentChildDiary());
  }, [router]);

  const handleSave = () => {
    if (!content.trim() || !selectedMood || !childId) return;

    const points = 15 + (content.length > 50 ? 5 : 0);

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      content: content.trim(),
      mood: selectedMood,
      weather: selectedWeather || 'sunny',
      createdAt: new Date().toISOString(),
      points,
    };

    addChildDiaryEntry(childId, entry);
    addChildPoints(childId, points);
    setEntries(prev => [entry, ...prev]);
    setContent('');
    setSelectedMood('');
    setSelectedWeather('');
    setIsWriting(false);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 2000);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const hasTodayEntry = entries.some(e => e.createdAt.startsWith(todayStr));

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-rose-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/child">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">내 일기</h1>
          </div>
          {!isWriting && (
            <Button
              onClick={() => setIsWriting(true)}
              className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              쓰기
            </Button>
          )}
        </div>

        {/* 일기 쓰기 폼 */}
        {isWriting && (
          <div className="bg-white rounded-3xl p-5 shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-800">
                {formatDate(new Date().toISOString())}
              </span>
            </div>

            {/* 기분 선택 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">오늘 기분은?</p>
              <div className="flex gap-2">
                {MOOD_EMOJIS.map(mood => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex-1 p-2 rounded-xl text-center transition-all ${
                      selectedMood === mood.value
                        ? 'bg-purple-100 ring-2 ring-purple-400 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl">{mood.emoji}</div>
                    <div className="text-xs text-gray-500">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 날씨 선택 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">오늘 날씨는?</p>
              <div className="flex gap-2">
                {WEATHER_EMOJIS.map(weather => (
                  <button
                    key={weather.value}
                    onClick={() => setSelectedWeather(weather.value)}
                    className={`flex-1 p-2 rounded-xl text-center transition-all ${
                      selectedWeather === weather.value
                        ? 'bg-blue-100 ring-2 ring-blue-400 scale-105'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl">{weather.emoji}</div>
                    <div className="text-xs text-gray-500">{weather.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 일기 내용 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">오늘 있었던 일</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="오늘 무슨 일이 있었어? 자유롭게 써봐!"
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:ring-0 resize-none text-base"
                rows={5}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {content.length}/500
              </p>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsWriting(false);
                  setContent('');
                  setSelectedMood('');
                  setSelectedWeather('');
                }}
                className="flex-1 py-5 rounded-2xl"
              >
                취소
              </Button>
              <Button
                onClick={handleSave}
                disabled={!content.trim() || !selectedMood}
                className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
              >
                저장하기
              </Button>
            </div>
          </div>
        )}

        {/* 일기 목록 */}
        {!isWriting && (
          <>
            {entries.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 shadow-md text-center">
                <div className="text-6xl mb-4">📔</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  아직 일기가 없어요
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  오늘 있었던 일을 써볼까?
                </p>
                <Button
                  onClick={() => setIsWriting(true)}
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  첫 일기 쓰기
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 오늘 일기 알림 */}
                {!hasTodayEntry && (
                  <div
                    onClick={() => setIsWriting(true)}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow">
                      ✏️
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">오늘 일기 쓰러 가기</p>
                      <p className="text-xs text-gray-500">포인트도 받을 수 있어!</p>
                    </div>
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                )}

                {/* 일기 목록 */}
                {entries.map(entry => {
                  const moodEmoji = MOOD_EMOJIS.find(m => m.value === entry.mood)?.emoji || '😊';
                  const weatherEmoji = WEATHER_EMOJIS.find(w => w.value === entry.weather)?.emoji || '☀️';

                  return (
                    <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{moodEmoji}</span>
                          <span className="text-sm font-medium text-gray-800">
                            {formatDate(entry.createdAt)}
                          </span>
                          <span className="text-lg">{weatherEmoji}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* 리워드 팝업 */}
        {showReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce shadow-2xl max-w-xs mx-4">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">일기 완료!</h3>
              <div className="flex items-center justify-center gap-2 text-xl">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-purple-500">+15 포인트</span>
              </div>
            </div>
          </div>
        )}

        {/* 하단 응원 메시지 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            <BookOpen className="w-4 h-4 text-purple-500" />
            {childName}의 소중한 이야기들
            <Sparkles className="w-4 h-4 text-pink-500" />
          </p>
        </div>
      </div>
    </div>
  );
}
