'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap, ClipboardList, History, TrendingUp, Calendar,
  MessageCircle, BookOpen, FolderOpen, Brain, Target,
  Globe, Award, ChevronRight, Sparkles, LogOut, Users,
  Plus, Check, Settings
} from 'lucide-react';
import { IB_PROFILE_DATABASE } from '@/lib/data/ib-profiles';
import { clearUserMode } from '@/lib/utils/storage';
import { AssessmentResult } from '@/lib/types/result';
import { ChildProfile } from '@/lib/types/child';
import {
  getChildren,
  getSelectedChildId,
  setSelectedChildId,
  getSelectedChild,
  getChildResults,
  getChildLatestResult,
  migrateToMultiChild,
} from '@/lib/utils/child-storage';

export function ParentDashboardClient() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedChild, setSelectedChildState] = useState<ChildProfile | null>(null);
  const [resultCount, setResultCount] = useState(0);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    // 마이그레이션 시도
    migrateToMultiChild();

    // 데이터 로드
    const childrenData = getChildren();
    setChildren(childrenData);

    const currentSelectedId = getSelectedChildId();
    setSelectedId(currentSelectedId);

    const currentChild = getSelectedChild();
    setSelectedChildState(currentChild);

    // 선택된 아이의 데이터 로드
    if (currentSelectedId) {
      const results = getChildResults(currentSelectedId);
      setResultCount(results.length);
      setLatestResult(getChildLatestResult(currentSelectedId));
    }
  }, []);

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    setSelectedId(childId);

    const child = children.find((c) => c.id === childId) || null;
    setSelectedChildState(child);

    if (childId) {
      const results = getChildResults(childId);
      setResultCount(results.length);
      setLatestResult(getChildLatestResult(childId));
    }
  };

  const handleModeSelect = (mode: 'quick' | 'full') => {
    sessionStorage.setItem('assessmentMode', mode);
  };

  const handleSwitchMode = () => {
    clearUserMode();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">부모님 모드</h2>
              {latestResult && (
                <p className="text-sm text-gray-500">{latestResult.basicInfo.nickname}의 성장을 관리해요</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSwitchMode} className="text-gray-500">
            <LogOut className="w-4 h-4 mr-1" />
            모드 전환
          </Button>
        </div>

        {/* 아이 선택 섹션 */}
        <div className="mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">내 아이</h3>
              <Link href="/parent/children" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Settings className="w-3 h-3" />
                아이 관리
              </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => handleSelectChild(child.id)}
                  className={`flex flex-col items-center min-w-[72px] p-3 rounded-xl transition-all ${
                    selectedId === child.id
                      ? 'bg-indigo-100 border-2 border-indigo-400 shadow-md'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="relative">
                    <span className="text-2xl">{child.avatar}</span>
                    {selectedId === child.id && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs mt-1 font-medium truncate max-w-[60px] ${
                    selectedId === child.id ? 'text-indigo-700' : 'text-gray-600'
                  }`}>
                    {child.nickname}
                  </span>
                </button>
              ))}

              {/* 아이 추가 버튼 */}
              <Link href="/parent/children" className="flex flex-col items-center min-w-[72px] p-3 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-xs mt-1 text-gray-500">추가</span>
              </Link>
            </div>

            {children.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">아직 등록된 아이가 없어요</p>
                <Link href="/parent/children">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="w-4 h-4" />
                    아이 등록하기
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* IB 상단 배너 */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base font-semibold">국제 바칼로레아(IB) 학습자상 기반</span>
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="text-center text-xs sm:text-sm opacity-90">
              전세계 160개국 5,700개 학교에서 인정하는 국제 교육 철학을 기반으로 아이의 성향을 분석합니다
            </p>
          </div>
        </div>

        {/* 메인 헤더 */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <Target className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
            아이의 미래를
            <br />
            <span className="text-blue-600">함께 그려요</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
            진로 검사로 아이의 성향을 파악하고
            <br className="sm:hidden" />
            맞춤 가이드를 받아보세요
          </p>

          {/* 모드 선택 버튼 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Link href="/parent/basic-info" onClick={() => handleModeSelect('quick')} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full h-auto border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50">
                <div className="text-left flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <div className="font-bold">빠른 검사</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">10문항 · 2-3분</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/parent/basic-info" onClick={() => handleModeSelect('full')} className="w-full sm:w-auto">
              <Button size="lg" className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full h-auto bg-gray-900 hover:bg-gray-800">
                <div className="text-left flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-bold">정밀 검사</div>
                    <div className="text-xs sm:text-sm opacity-90">34문항 · 7-10분</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* 기존 결과 및 성장 관리 섹션 */}
        {resultCount > 0 && (
          <div className="mb-10 sm:mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  {latestResult?.basicInfo.nickname}님의 성장 관리
                </h2>
                <span className="text-xs sm:text-sm text-gray-500">
                  총 {resultCount}회 검사
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/parent/history" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all">
                    <History className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">검사 히스토리</p>
                    <p className="text-xs text-gray-500 mt-0.5">결과 비교 및 분석</p>
                  </div>
                </Link>

                <Link href="/parent/goals" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:border-green-300 hover:shadow-md transition-all">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">성장 목표</p>
                    <p className="text-xs text-gray-500 mt-0.5">목표 설정 및 추적</p>
                  </div>
                </Link>

                <Link href="/parent/check-in" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-md transition-all">
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">관찰 기록</p>
                    <p className="text-xs text-gray-500 mt-0.5">아이 관찰 및 메모</p>
                  </div>
                </Link>

                <Link href="/parent/conversation" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all">
                    <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">대화 카드</p>
                    <p className="text-xs text-gray-500 mt-0.5">대화 주제 추천</p>
                  </div>
                </Link>

                <Link href="/parent/diary" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">성장 다이어리</p>
                    <p className="text-xs text-gray-500 mt-0.5">성장 기록 보기</p>
                  </div>
                </Link>

                <Link href="/parent/portfolio" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-100 hover:border-cyan-300 hover:shadow-md transition-all">
                    <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">포트폴리오</p>
                    <p className="text-xs text-gray-500 mt-0.5">성장 여정 종합</p>
                  </div>
                </Link>

                <Link href="/parent/report" className="group">
                  <div className="p-3 sm:p-4 bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-xl border border-fuchsia-100 hover:border-fuchsia-300 hover:shadow-md transition-all">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-500 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="font-medium text-sm sm:text-base text-gray-800">AI 리포트</p>
                    <p className="text-xs text-gray-500 mt-0.5">AI 분석 및 추천</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* IB 학습자상 10가지 섹션 */}
        <div className="mt-12 sm:mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              IB 학습자상 <span className="text-purple-600">10가지</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              국제 바칼로레아가 추구하는 인재상을 기반으로 아이의 강점을 발견해요
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {IB_PROFILE_DATABASE.map((profile) => (
              <div
                key={profile.id}
                className="group bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] cursor-default"
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-200">
                  {profile.icon}
                </div>
                <div className="font-medium text-xs sm:text-sm text-gray-700 mb-0.5">
                  {profile.nameKo}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400">
                  {profile.nameEn}
                </div>
              </div>
            ))}
          </div>

          {/* IB 출처 정보 */}
          <div className="mt-4 sm:mt-6 text-center">
            <a
              href="https://www.ibo.org/benefits/learner-profile/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 hover:underline"
            >
              <span>IB 학습자상 공식 문서 보기</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
