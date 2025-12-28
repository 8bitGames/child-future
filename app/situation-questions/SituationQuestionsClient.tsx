'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { SituationQuestions, type SituationResponse } from '@/components/SituationQuestions';
import { OptionalBadge } from '@/components/SkipButton';
import { ArrowLeft, Sparkles, Info } from 'lucide-react';
import type { BasicInfo } from '@/lib/types/assessment';

export function SituationQuestionsClient() {
  const router = useRouter();
  const [basicInfo, setBasicInfo] = useState<BasicInfo | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    // 이전 단계 데이터 확인
    const basicInfoStr = sessionStorage.getItem('basicInfo');
    const responses = sessionStorage.getItem('responses');

    if (!basicInfoStr || !responses) {
      router.push('/basic-info');
      return;
    }

    try {
      setBasicInfo(JSON.parse(basicInfoStr));
    } catch (e) {
      console.error('Failed to parse basicInfo:', e);
      router.push('/basic-info');
    }
  }, [router]);

  const handleSkip = () => {
    // 건너뛰기 - 상황 질문 응답 없이 결과로
    sessionStorage.setItem('situationResponses', JSON.stringify({
      skipped: true,
      responses: []
    }));
    router.push('/results');
  };

  const handleComplete = (responses: SituationResponse[]) => {
    // 응답 저장
    sessionStorage.setItem('situationResponses', JSON.stringify({
      skipped: false,
      responses,
      completedAt: new Date().toISOString()
    }));
    router.push('/results');
  };

  const handleBack = () => {
    router.push('/assessment');
  };

  if (!basicInfo) {
    return null; // 로딩 중
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 상단 고정 진행 단계 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm py-3 px-4 sm:hidden">
        <div className="max-w-3xl mx-auto">
          <Stepper
            currentStep={4}
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
            currentStep={4}
            steps={['기본정보', '관찰평가', '상담내용', '성향테스트', '상황질문', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              상황 질문
            </h1>
            <OptionalBadge />
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {basicInfo.nickname}의 생각과 행동 방식을 알아보는 질문이에요
          </p>
        </div>

        {!showQuestions ? (
          // 설명 화면
          <div className="space-y-6">
            {/* 안내 카드 */}
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-2">상황 질문이란?</p>
                    <p className="mb-2">
                      다양한 상황에서 {basicInfo.nickname}이(가) 어떻게 행동하고 싶은지 물어보는 질문이에요.
                      정답이 없으니 편하게 대답해주세요!
                    </p>
                    <p className="text-xs text-purple-600">
                      * 이 단계는 선택사항이며, IB 학습자상 분석의 정확도를 높여줍니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 안내 사항 */}
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">1</span>
                  </div>
                  <p className="text-sm sm:text-base">상황을 읽고 가장 하고 싶은 것을 골라주세요</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-xl">2</span>
                  </div>
                  <p className="text-sm sm:text-base">정답은 없어요. 솔직하게 대답해주세요</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xl">3</span>
                  </div>
                  <p className="text-sm sm:text-base">{basicInfo.age}세에 맞는 질문 4개가 나와요</p>
                </div>
              </CardContent>
            </Card>

            {/* 시작/건너뛰기 버튼 */}
            <div className="space-y-4">
              <Button
                onClick={() => setShowQuestions(true)}
                size="lg"
                className="w-full"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                상황 질문 시작하기
              </Button>

              <Button
                variant="outline"
                onClick={handleSkip}
                size="lg"
                className="w-full text-muted-foreground"
              >
                건너뛰고 결과 보기
              </Button>
            </div>

            {/* 이전 버튼 */}
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전 단계로
              </Button>
            </div>
          </div>
        ) : (
          // 질문 화면
          <SituationQuestions
            childAge={basicInfo.age}
            childNickname={basicInfo.nickname}
            questionCount={4}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        )}

        {/* 모바일 하단 스페이서 */}
        <div className="h-20 sm:hidden" />
      </div>
    </div>
  );
}
