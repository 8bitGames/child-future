'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/ui/stepper';
import { SkipButton, OptionalBadge } from '@/components/SkipButton';
import { ObservationChecklist } from '@/components/ObservationChecklist';
import { ArrowLeft, ArrowRight, Eye, Users, Info } from 'lucide-react';
import type { ObservationFrequency } from '@/lib/types/ib-enhanced';

interface ObservationResponse {
  itemId: string;
  frequency: ObservationFrequency;
}

type ObserverType = 'parent' | 'teacher';
type ChecklistMode = 'quick' | 'full';

export function ParentInfoClient() {
  const router = useRouter();
  const [childAge, setChildAge] = useState<number>(10);
  const [observerType, setObserverType] = useState<ObserverType>('parent');
  const [checklistMode, setChecklistMode] = useState<ChecklistMode>('quick');
  const [showChecklist, setShowChecklist] = useState(false);
  const [responses, setResponses] = useState<ObservationResponse[]>([]);

  // 기본 정보에서 나이 가져오기
  useEffect(() => {
    const basicInfoStr = sessionStorage.getItem('basicInfo');
    if (basicInfoStr) {
      try {
        const basicInfo = JSON.parse(basicInfoStr);
        if (basicInfo.age) {
          setChildAge(basicInfo.age);
        }
      } catch (e) {
        console.error('Failed to parse basicInfo:', e);
      }
    }
  }, []);

  const handleSkip = () => {
    // 건너뛰기 - 관찰 데이터 없이 다음 단계로
    sessionStorage.setItem('parentObservation', JSON.stringify({
      skipped: true,
      observerType: null,
      responses: []
    }));
    router.push('/consultation');
  };

  const handleChecklistComplete = (completedResponses: ObservationResponse[]) => {
    setResponses(completedResponses);

    // sessionStorage에 저장
    sessionStorage.setItem('parentObservation', JSON.stringify({
      skipped: false,
      observerType,
      checklistMode,
      responses: completedResponses,
      completedAt: new Date().toISOString()
    }));

    // 다음 단계로
    router.push('/consultation');
  };

  const handleStartChecklist = () => {
    setShowChecklist(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 상단 고정 진행 단계 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm py-3 px-4 sm:hidden">
        <div className="max-w-3xl mx-auto">
          <Stepper
            currentStep={2}
            steps={['기본정보', '관찰평가', '상담내용', '성향테스트', '상황질문', '결과']}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* 모바일 상단 스페이서 */}
        <div className="h-14 sm:hidden" />

        {/* 데스크톱 진행 단계 */}
        <div className="hidden sm:block mb-8">
          <Stepper
            currentStep={2}
            steps={['기본정보', '관찰평가', '상담내용', '성향테스트', '상황질문', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">관찰 체크리스트</h1>
            <OptionalBadge />
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            부모님 또는 선생님이 아이의 평소 행동을 관찰한 내용을 입력해주세요
          </p>
        </div>

        {!showChecklist ? (
          // 설정 화면
          <div className="space-y-6">
            {/* 안내 카드 */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">이 단계는 선택사항입니다</p>
                    <p>
                      관찰 체크리스트를 작성하면 아이의 IB 학습자상 분석이 더욱 정확해집니다.
                      건너뛰셔도 기본 분석 결과를 받으실 수 있습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 관찰자 유형 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관찰자 유형</CardTitle>
                <CardDescription>누가 아이를 관찰하셨나요?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  type="button"
                  onClick={() => setObserverType('parent')}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4
                    ${observerType === 'parent'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${observerType === 'parent' ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <Users className={`w-6 h-6 ${observerType === 'parent' ? 'text-primary' : 'text-gray-500'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${observerType === 'parent' ? 'text-primary' : 'text-gray-900'}`}>
                      부모님
                    </p>
                    <p className="text-sm text-gray-500">가정에서의 행동을 관찰</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setObserverType('teacher')}
                  className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4
                    ${observerType === 'teacher'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center
                    ${observerType === 'teacher' ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <Eye className={`w-6 h-6 ${observerType === 'teacher' ? 'text-primary' : 'text-gray-500'}`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${observerType === 'teacher' ? 'text-primary' : 'text-gray-900'}`}>
                      선생님
                    </p>
                    <p className="text-sm text-gray-500">학교/학원에서의 행동을 관찰</p>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* 체크리스트 모드 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">체크리스트 유형</CardTitle>
                <CardDescription>얼마나 자세하게 평가하시겠어요?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  type="button"
                  onClick={() => setChecklistMode('quick')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left
                    ${checklistMode === 'quick'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className={`font-medium ${checklistMode === 'quick' ? 'text-primary' : 'text-gray-900'}`}>
                      간편 모드
                    </p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      추천
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">핵심 질문 10개 (약 3분)</p>
                </button>

                <button
                  type="button"
                  onClick={() => setChecklistMode('full')}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left
                    ${checklistMode === 'full'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <p className={`font-medium ${checklistMode === 'full' ? 'text-primary' : 'text-gray-900'}`}>
                    상세 모드
                  </p>
                  <p className="text-sm text-gray-500">전체 질문 약 25개 (약 10분)</p>
                </button>
              </CardContent>
            </Card>

            {/* 시작 버튼 */}
            <div className="space-y-4">
              <Button
                onClick={handleStartChecklist}
                size="lg"
                className="w-full"
              >
                체크리스트 시작하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <SkipButton
                onSkip={handleSkip}
                message="관찰 체크리스트를 건너뛰면 아이의 직접 응답만으로 결과가 생성됩니다."
                className="flex flex-col items-center"
              />
            </div>

            {/* 데스크톱 네비게이션 */}
            <div className="hidden sm:flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => router.push('/basic-info')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
            </div>
          </div>
        ) : (
          // 체크리스트 화면
          <ObservationChecklist
            childAge={childAge}
            mode={checklistMode}
            observerType={observerType}
            onComplete={handleChecklistComplete}
            onSkip={handleSkip}
          />
        )}

        {/* 모바일 하단 스페이서 */}
        <div className="h-20 sm:hidden" />
      </div>

      {/* 모바일 고정 버튼 - 설정 화면에서만 표시 */}
      {!showChecklist && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg sm:hidden">
          <div className="flex gap-3 max-w-3xl mx-auto">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => router.push('/basic-info')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전
            </Button>
            <Button
              size="lg"
              className="flex-1"
              onClick={handleStartChecklist}
            >
              시작
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
