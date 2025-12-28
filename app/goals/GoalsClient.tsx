'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { getLatestResult } from '@/lib/utils/storage';
import { AssessmentResult, IB_PROFILE_NAMES, IBProfile } from '@/lib/types/result';
import { CAREER_CATEGORY_NAMES, CareerCategory } from '@/lib/types/assessment';
import {
  ArrowLeft,
  Plus,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Save,
  X,
  Calendar,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Trophy
} from 'lucide-react';

// 목표 타입 정의
interface Goal {
  id: string;
  title: string;
  description: string;
  targetIBProfile?: IBProfile;
  targetCategory?: CareerCategory;
  periodStart: string;
  periodEnd: string;
  recommendedActivities: string[];
  progress: number; // 0-100
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'child-future-goals';

// 목표 저장
function saveGoals(goals: Goal[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

// 목표 가져오기
function getGoals(): Goal[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 추천 활동 데이터
const RECOMMENDED_ACTIVITIES: Record<IBProfile, string[]> = {
  'Inquirer': ['과학 실험 프로젝트', '자연 탐구 일기 쓰기', '박물관/과학관 방문', '질문 일기 작성하기', '"왜?" 대화 나누기'],
  'Knowledgeable': ['독서 챌린지', '주제별 조사 보고서', '다큐멘터리 시청', '새로운 분야 공부하기', '지식 퀴즈 만들기'],
  'Thinker': ['퍼즐/보드게임', '논리 문제 풀기', '생각 정리 마인드맵', '토론 참여하기', '문제 해결 일기'],
  'Communicator': ['발표 연습', '그룹 프로젝트 참여', '외국어 학습', '편지/이메일 쓰기', '스토리텔링 연습'],
  'Principled': ['봉사활동 참여', '약속 지키기 챌린지', '공정한 게임 진행', '규칙 만들기 활동', '정직 일기 쓰기'],
  'Open-minded': ['다른 문화 체험', '새로운 음식 도전', '다양한 의견 듣기', '미술관/전시회 방문', '다른 관점으로 생각하기'],
  'Caring': ['친구 돕기', '감사 일기 쓰기', '동물/식물 돌보기', '가족을 위한 작은 선물', '배려의 말 연습하기'],
  'Risk-taker': ['새로운 취미 도전', '발표 자원하기', '실패해도 괜찮아 챌린지', '모험적인 놀이', '새로운 친구 사귀기'],
  'Balanced': ['운동과 공부 균형 잡기', '휴식 시간 갖기', '다양한 활동 체험', '일과표 만들기', '취미 활동 즐기기'],
  'Reflective': ['일기 쓰기', '오늘의 배움 기록', '목표 점검 시간', '자기 평가 연습', '감정 일기 작성']
};

export function GoalsClient() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // 새 목표 폼 상태
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetIBProfile: '' as IBProfile | '',
    periodWeeks: 4,
    selectedActivities: [] as string[]
  });

  useEffect(() => {
    const result = getLatestResult();
    setLatestResult(result);
    setGoals(getGoals());
    setLoading(false);
  }, []);

  const handleCreateGoal = () => {
    if (!newGoal.title.trim()) return;

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + newGoal.periodWeeks * 7);

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetIBProfile: newGoal.targetIBProfile || undefined,
      targetCategory: latestResult?.topCategories[0],
      periodStart: now.toISOString(),
      periodEnd: endDate.toISOString(),
      recommendedActivities: newGoal.selectedActivities,
      progress: 0,
      status: 'active',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    saveGoals(updatedGoals);

    // 폼 초기화
    setNewGoal({
      title: '',
      description: '',
      targetIBProfile: '',
      periodWeeks: 4,
      selectedActivities: []
    });
    setShowNewGoalForm(false);
  };

  const handleUpdateProgress = (goalId: string, progress: number) => {
    const updatedGoals = goals.map(g =>
      g.id === goalId
        ? { ...g, progress, status: progress >= 100 ? 'completed' as const : 'active' as const, updatedAt: new Date().toISOString() }
        : g
    );
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('이 목표를 삭제하시겠습니까?')) {
      const updatedGoals = goals.filter(g => g.id !== goalId);
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
    }
  };

  const handleToggleActivity = (activity: string) => {
    setNewGoal(prev => ({
      ...prev,
      selectedActivities: prev.selectedActivities.includes(activity)
        ? prev.selectedActivities.filter(a => a !== activity)
        : [...prev.selectedActivities, activity]
    }));
  };

  const getAvailableActivities = (): string[] => {
    if (newGoal.targetIBProfile) {
      return RECOMMENDED_ACTIVITIES[newGoal.targetIBProfile as IBProfile] || [];
    }
    if (latestResult?.ibProfiles[0]) {
      return RECOMMENDED_ACTIVITIES[latestResult.ibProfiles[0]] || [];
    }
    return [];
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-7 w-7 text-green-600" />
                성장 목표
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {latestResult?.basicInfo.nickname}님의 목표 관리
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowNewGoalForm(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            새 목표
          </Button>
        </div>

        {/* 검사 결과 없음 안내 */}
        {!latestResult && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 font-medium">검사 결과가 없습니다</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    진로 탐색 검사를 먼저 진행하면 맞춤 목표를 추천받을 수 있어요.
                  </p>
                  <Link href="/" className="inline-block mt-3">
                    <Button variant="outline" size="sm" className="border-yellow-400 text-yellow-700 hover:bg-yellow-100">
                      검사 시작하기
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 새 목표 폼 */}
        {showNewGoalForm && (
          <Card className="mb-6 border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-600" />
                새 목표 만들기
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">목표 제목 *</label>
                <Input
                  placeholder="예: 매일 책 읽기, 새로운 친구 사귀기"
                  value={newGoal.title}
                  onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">목표 설명</label>
                <Textarea
                  placeholder="목표에 대한 자세한 설명을 적어주세요"
                  value={newGoal.description}
                  onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">연계 IB 학습자상</label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={newGoal.targetIBProfile}
                    onChange={e => setNewGoal(prev => ({
                      ...prev,
                      targetIBProfile: e.target.value as IBProfile | '',
                      selectedActivities: []
                    }))}
                  >
                    <option value="">선택하세요</option>
                    {latestResult?.ibProfiles.map(profile => (
                      <option key={profile} value={profile}>
                        {IB_PROFILE_NAMES[profile]} (추천)
                      </option>
                    ))}
                    {Object.entries(IB_PROFILE_NAMES)
                      .filter(([key]) => !latestResult?.ibProfiles.includes(key as IBProfile))
                      .map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">목표 기간</label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={newGoal.periodWeeks}
                    onChange={e => setNewGoal(prev => ({ ...prev, periodWeeks: parseInt(e.target.value) }))}
                  >
                    <option value={1}>1주</option>
                    <option value={2}>2주</option>
                    <option value={4}>4주 (1개월)</option>
                    <option value={8}>8주 (2개월)</option>
                    <option value={12}>12주 (3개월)</option>
                  </select>
                </div>
              </div>

              {/* 추천 활동 선택 */}
              {getAvailableActivities().length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    추천 활동 선택
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableActivities().map(activity => (
                      <button
                        key={activity}
                        onClick={() => handleToggleActivity(activity)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          newGoal.selectedActivities.includes(activity)
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleCreateGoal}
                  disabled={!newGoal.title.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  목표 저장
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewGoalForm(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  취소
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 진행 중인 목표 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            진행 중인 목표 ({activeGoals.length})
          </h2>

          {activeGoals.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">아직 설정된 목표가 없어요</p>
                <Button
                  variant="outline"
                  onClick={() => setShowNewGoalForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  첫 번째 목표 만들기
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeGoals.map(goal => {
                const startDate = new Date(goal.periodStart);
                const endDate = new Date(goal.periodEnd);
                const now = new Date();
                const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                const daysRemaining = Math.max(0, totalDays - elapsedDays);

                return (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{goal.title}</h3>
                          {goal.description && (
                            <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* 진행률 */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">진행률</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      {/* 진행률 조절 버튼 */}
                      <div className="flex gap-2 mb-4">
                        {[0, 25, 50, 75, 100].map(value => (
                          <button
                            key={value}
                            onClick={() => handleUpdateProgress(goal.id, value)}
                            className={`flex-1 py-1.5 text-xs rounded-md transition-all ${
                              goal.progress >= value
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>

                      {/* 메타 정보 */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {daysRemaining}일 남음
                        </span>
                        {goal.targetIBProfile && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {IB_PROFILE_NAMES[goal.targetIBProfile]}
                          </span>
                        )}
                      </div>

                      {/* 추천 활동 */}
                      {goal.recommendedActivities.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs font-medium text-gray-600 mb-2">추천 활동</p>
                          <div className="flex flex-wrap gap-1.5">
                            {goal.recommendedActivities.map((activity, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* 완료된 목표 */}
        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              완료된 목표 ({completedGoals.length})
            </h2>

            <div className="space-y-3">
              {completedGoals.map(goal => (
                <Card key={goal.id} className="bg-green-50 border-green-200">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">{goal.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(goal.updatedAt).toLocaleDateString('ko-KR')} 완료
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
