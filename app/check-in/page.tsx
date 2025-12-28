'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getLatestResult } from '@/lib/utils/storage';
import { AssessmentResult } from '@/lib/types/result';
import {
  ArrowLeft,
  Calendar,
  Smile,
  Meh,
  Frown,
  Star,
  Heart,
  Sparkles,
  Save,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  MessageCircle,
  Activity,
  AlertTriangle
} from 'lucide-react';

// 체크인 타입 정의
interface WeeklyCheckIn {
  id: string;
  weekStart: string;
  weekEnd: string;
  childData: {
    activityLevel: 'high' | 'medium' | 'low' | null;
    favoriteActivity: string;
    weeklyMood: 'great' | 'good' | 'okay' | 'notgood' | 'bad' | null;
    freeNote: string;
  };
  parentData: {
    noticeableChanges: string;
    completedActivities: string[];
    specialEpisode: string;
  };
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'child-future-checkins';

// 체크인 저장
function saveCheckIns(checkIns: WeeklyCheckIn[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checkIns));
}

// 체크인 가져오기
function getCheckIns(): WeeklyCheckIn[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 주간 날짜 계산
function getWeekDates(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // 월요일 시작
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

// 기분 이모지 매핑
const MOOD_OPTIONS = [
  { value: 'great', icon: '😄', label: '최고!' },
  { value: 'good', icon: '🙂', label: '좋아요' },
  { value: 'okay', icon: '😐', label: '보통' },
  { value: 'notgood', icon: '😕', label: '별로' },
  { value: 'bad', icon: '😢', label: '힘들어요' }
];

// 활동량 옵션
const ACTIVITY_OPTIONS = [
  { value: 'high', icon: '🔥', label: '매우 활발' },
  { value: 'medium', icon: '⚡', label: '보통' },
  { value: 'low', icon: '💤', label: '조용히' }
];

// 추천 활동 목록
const SUGGESTED_ACTIVITIES = [
  '책 읽기', '그림 그리기', '운동하기', '친구와 놀기',
  '요리/베이킹', '음악 듣기/연주', '게임하기', '만들기/조립',
  '글쓰기', '탐구 활동', '봉사 활동', '자연 체험',
  '박물관/전시 방문', '영화/공연 관람', '새로운 것 배우기'
];

export default function CheckInPage() {
  const [checkIns, setCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [formTab, setFormTab] = useState<'child' | 'parent'>('child');

  // 현재 선택된 주
  const [selectedWeek, setSelectedWeek] = useState(() => {
    return getWeekDates(new Date());
  });

  // 현재 체크인 데이터
  const [currentCheckIn, setCurrentCheckIn] = useState<WeeklyCheckIn>({
    id: '',
    weekStart: '',
    weekEnd: '',
    childData: {
      activityLevel: null,
      favoriteActivity: '',
      weeklyMood: null,
      freeNote: ''
    },
    parentData: {
      noticeableChanges: '',
      completedActivities: [],
      specialEpisode: ''
    },
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    const result = getLatestResult();
    setLatestResult(result);
    const storedCheckIns = getCheckIns();
    setCheckIns(storedCheckIns);
    setLoading(false);
  }, []);

  // 주 변경 시 체크인 데이터 로드
  useEffect(() => {
    const { start, end } = selectedWeek;
    const weekStartStr = start.toISOString();
    const weekEndStr = end.toISOString();

    const existing = checkIns.find(c =>
      c.weekStart === weekStartStr
    );

    if (existing) {
      setCurrentCheckIn(existing);
    } else {
      setCurrentCheckIn({
        id: Date.now().toString(),
        weekStart: weekStartStr,
        weekEnd: weekEndStr,
        childData: {
          activityLevel: null,
          favoriteActivity: '',
          weeklyMood: null,
          freeNote: ''
        },
        parentData: {
          noticeableChanges: '',
          completedActivities: [],
          specialEpisode: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }, [selectedWeek, checkIns]);

  const handleWeekChange = (offset: number) => {
    const newOffset = currentWeekOffset + offset;
    if (newOffset > 0) return; // 미래 주는 선택 불가

    setCurrentWeekOffset(newOffset);
    const date = new Date();
    date.setDate(date.getDate() + newOffset * 7);
    setSelectedWeek(getWeekDates(date));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const updatedCheckIn = {
      ...currentCheckIn,
      updatedAt: now
    };

    const existingIndex = checkIns.findIndex(c => c.weekStart === currentCheckIn.weekStart);
    let updatedCheckIns: WeeklyCheckIn[];

    if (existingIndex >= 0) {
      updatedCheckIns = checkIns.map((c, i) =>
        i === existingIndex ? updatedCheckIn : c
      );
    } else {
      updatedCheckIns = [...checkIns, { ...updatedCheckIn, createdAt: now }];
    }

    setCheckIns(updatedCheckIns);
    saveCheckIns(updatedCheckIns);
    alert('체크인이 저장되었습니다!');
  };

  const handleToggleActivity = (activity: string) => {
    setCurrentCheckIn(prev => ({
      ...prev,
      parentData: {
        ...prev.parentData,
        completedActivities: prev.parentData.completedActivities.includes(activity)
          ? prev.parentData.completedActivities.filter(a => a !== activity)
          : [...prev.parentData.completedActivities, activity]
      }
    }));
  };

  const formatWeekRange = () => {
    const startStr = selectedWeek.start.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    const endStr = selectedWeek.end.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
    return `${startStr} ~ ${endStr}`;
  };

  const isCurrentWeek = currentWeekOffset === 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-7 w-7 text-orange-600" />
              주간 체크인
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {latestResult?.basicInfo.nickname || '아이'}의 한 주를 돌아봐요
            </p>
          </div>
        </div>

        {/* 주 선택 */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleWeekChange(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="text-center">
                <p className="font-bold text-lg text-gray-900">
                  {formatWeekRange()}
                </p>
                {isCurrentWeek && (
                  <span className="text-xs text-orange-600 font-medium">이번 주</span>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleWeekChange(1)}
                disabled={isCurrentWeek}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 탭 선택 */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={formTab === 'child' ? 'default' : 'outline'}
            onClick={() => setFormTab('child')}
            className={formTab === 'child' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            아이 체크인
          </Button>
          <Button
            variant={formTab === 'parent' ? 'default' : 'outline'}
            onClick={() => setFormTab('parent')}
            className={formTab === 'parent' ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            <Heart className="h-4 w-4 mr-2" />
            부모 체크인
          </Button>
        </div>

        {/* 아이 체크인 폼 */}
        {formTab === 'child' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                {latestResult?.basicInfo.nickname || '아이'}의 한 주는 어땠나요?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 이번 주 기분 */}
              <div>
                <label className="block text-sm font-medium mb-3">이번 주 기분은요?</label>
                <div className="flex justify-between gap-2">
                  {MOOD_OPTIONS.map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => setCurrentCheckIn(prev => ({
                        ...prev,
                        childData: { ...prev.childData, weeklyMood: mood.value as WeeklyCheckIn['childData']['weeklyMood'] }
                      }))}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                        currentCheckIn.childData.weeklyMood === mood.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.icon}</div>
                      <div className="text-xs text-gray-600">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 활동량 */}
              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-orange-500" />
                  이번 주 활동량
                </label>
                <div className="flex gap-3">
                  {ACTIVITY_OPTIONS.map(activity => (
                    <button
                      key={activity.value}
                      onClick={() => setCurrentCheckIn(prev => ({
                        ...prev,
                        childData: { ...prev.childData, activityLevel: activity.value as WeeklyCheckIn['childData']['activityLevel'] }
                      }))}
                      className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                        currentCheckIn.childData.activityLevel === activity.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="text-xl mb-1">{activity.icon}</div>
                      <div className="text-sm font-medium">{activity.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 가장 재미있었던 활동 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  이번 주 가장 재미있었던 활동은?
                </label>
                <Input
                  placeholder="예: 친구랑 축구했어요!"
                  value={currentCheckIn.childData.favoriteActivity}
                  onChange={e => setCurrentCheckIn(prev => ({
                    ...prev,
                    childData: { ...prev.childData, favoriteActivity: e.target.value }
                  }))}
                />
              </div>

              {/* 자유 기록 */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-orange-500" />
                  하고 싶은 이야기
                </label>
                <Textarea
                  placeholder="이번 주에 있었던 일, 느낀 점 등을 자유롭게 적어보세요"
                  value={currentCheckIn.childData.freeNote}
                  onChange={e => setCurrentCheckIn(prev => ({
                    ...prev,
                    childData: { ...prev.childData, freeNote: e.target.value }
                  }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* 부모 체크인 폼 */}
        {formTab === 'parent' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Heart className="h-5 w-5 text-pink-500" />
                부모님이 관찰한 한 주
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 완료한 활동 */}
              <div>
                <label className="block text-sm font-medium mb-3">이번 주 완료한 활동</label>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_ACTIVITIES.map(activity => (
                    <button
                      key={activity}
                      onClick={() => handleToggleActivity(activity)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        currentCheckIn.parentData.completedActivities.includes(activity)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {currentCheckIn.parentData.completedActivities.includes(activity) && (
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                      )}
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              {/* 눈에 띄는 변화 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  아이에게서 발견한 눈에 띄는 변화
                </label>
                <Textarea
                  placeholder="이번 주에 아이에게서 발견한 새로운 모습이나 성장한 점을 적어주세요"
                  value={currentCheckIn.parentData.noticeableChanges}
                  onChange={e => setCurrentCheckIn(prev => ({
                    ...prev,
                    parentData: { ...prev.parentData, noticeableChanges: e.target.value }
                  }))}
                  rows={3}
                />
              </div>

              {/* 특별한 에피소드 */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  이번 주의 특별한 순간
                </label>
                <Textarea
                  placeholder="기억에 남는 에피소드나 대화를 기록해주세요"
                  value={currentCheckIn.parentData.specialEpisode}
                  onChange={e => setCurrentCheckIn(prev => ({
                    ...prev,
                    parentData: { ...prev.parentData, specialEpisode: e.target.value }
                  }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* 저장 버튼 */}
        <div className="mt-6">
          <Button
            onClick={handleSave}
            className="w-full bg-orange-600 hover:bg-orange-700 py-6 text-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            체크인 저장하기
          </Button>
        </div>

        {/* 이전 체크인 목록 */}
        {checkIns.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              이전 체크인 기록
            </h2>
            <div className="space-y-2">
              {checkIns
                .sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime())
                .slice(0, 5)
                .map(checkIn => {
                  const startDate = new Date(checkIn.weekStart);
                  const endDate = new Date(checkIn.weekEnd);
                  const hasMood = checkIn.childData?.weeklyMood;
                  const mood = MOOD_OPTIONS.find(m => m.value === checkIn.childData?.weeklyMood);

                  return (
                    <Card
                      key={checkIn.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        const weekDates = getWeekDates(new Date(checkIn.weekStart));
                        setSelectedWeek(weekDates);
                        const today = new Date();
                        const weeksDiff = Math.floor(
                          (today.getTime() - new Date(checkIn.weekStart).getTime()) / (7 * 24 * 60 * 60 * 1000)
                        );
                        setCurrentWeekOffset(-weeksDiff);
                      }}
                    >
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{mood?.icon || '📅'}</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {startDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} ~{' '}
                                {endDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                              </p>
                              {checkIn.childData?.favoriteActivity && (
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {checkIn.childData.favoriteActivity}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {(checkIn.parentData?.completedActivities?.length ?? 0) > 0 && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                {checkIn.parentData.completedActivities.length}개 활동
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
