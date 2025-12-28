'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';
import { QuestionResponse, AssessmentMode, Question, BasicInfo, SituationOption } from '@/lib/types/assessment';
import { SCALE_LABELS } from '@/lib/data/questions';
import { ArrowLeft, ArrowRight, Zap, ClipboardList, Lightbulb, Loader2, Plus } from 'lucide-react';

export function AssessmentClient() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<1 | 2 | 3 | 4 | 5 | 'A' | 'B' | 'C' | 'D' | null>(null);
  const [mode, setMode] = useState<AssessmentMode>('full');
  const [previousResponses, setPreviousResponses] = useState<QuestionResponse[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 이전 단계 데이터 확인
    const basicInfoStr = sessionStorage.getItem('basicInfo');
    const consultation = sessionStorage.getItem('consultation');
    if (!basicInfoStr || !consultation) {
      router.push('/parent/basic-info');
      return;
    }

    // 모드 확인
    const savedMode = sessionStorage.getItem('assessmentMode') as AssessmentMode;
    if (savedMode) {
      setMode(savedMode);
    }

    // extend 모드일 경우 기존 응답 로드
    if (savedMode === 'extend') {
      const savedResponses = sessionStorage.getItem('quickResponses');
      if (savedResponses) {
        setPreviousResponses(JSON.parse(savedResponses));
      }
    }

    // 개인화된 질문 생성
    const generateQuestions = async () => {
      setIsLoading(true);
      try {
        const basicInfo: BasicInfo = JSON.parse(basicInfoStr);
        const response = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            basicInfo,
            mode: savedMode || 'full'
          })
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Failed to generate questions:', error);
        // 에러 시 기본 질문 사용 - 동적 import
        const { ASSESSMENT_QUESTIONS, QUICK_QUESTION_IDS, FULL_ASSESSMENT_QUESTIONS } = await import('@/lib/data/questions');
        let fallbackQuestions = ASSESSMENT_QUESTIONS;
        if (savedMode === 'quick') {
          fallbackQuestions = ASSESSMENT_QUESTIONS.filter(q => QUICK_QUESTION_IDS.includes(q.id));
        } else if (savedMode === 'extend') {
          fallbackQuestions = ASSESSMENT_QUESTIONS.filter(q => !QUICK_QUESTION_IDS.includes(q.id));
        } else if (savedMode === 'full') {
          fallbackQuestions = FULL_ASSESSMENT_QUESTIONS;
        }
        setQuestions(fallbackQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, [router]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleScaleAnswer = (value: 1 | 2 | 3 | 4 | 5) => {
    setCurrentAnswer(value);
  };

  const handleSituationAnswer = (value: 'A' | 'B' | 'C' | 'D') => {
    setCurrentAnswer(value);
  };

  const isQuestionSituation = currentQuestion?.type === 'situation';

  const handleNext = () => {
    if (currentAnswer === null) {
      alert('답변을 선택해주세요');
      return;
    }

    // 응답 저장
    const newResponse: QuestionResponse = {
      questionId: currentQuestion.id,
      value: currentAnswer
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    // 다음 질문으로
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(null);
    } else {
      // 마지막 질문 완료
      if (mode === 'quick') {
        // 빠른 검사: quickResponses에 저장
        sessionStorage.setItem('quickResponses', JSON.stringify(updatedResponses));
        sessionStorage.setItem('responses', JSON.stringify(updatedResponses));
      } else if (mode === 'extend') {
        // 확장 검사: 기존 응답 + 새 응답 병합
        const mergedResponses = [...previousResponses, ...updatedResponses];
        sessionStorage.setItem('responses', JSON.stringify(mergedResponses));
        sessionStorage.setItem('assessmentMode', 'full'); // 결과는 full로 표시
      } else {
        // 정밀 검사
        sessionStorage.setItem('responses', JSON.stringify(updatedResponses));
      }
      router.push('/parent/situation-questions');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // 이전 답변 복원
      const previousResponse = responses[currentQuestionIndex - 1];
      setCurrentAnswer(previousResponse?.value ?? null);
      // 응답 배열에서 현재 답변 제거
      setResponses(responses.slice(0, -1));
    } else {
      router.push('/parent/consultation');
    }
  };

  const getModeIcon = () => {
    if (mode === 'quick') return <Zap className="w-5 h-5 text-yellow-500" />;
    if (mode === 'extend') return <Plus className="w-5 h-5 text-blue-500" />;
    return <ClipboardList className="w-5 h-5 text-blue-500" />;
  };

  const getModeTitle = () => {
    if (mode === 'quick') return '빠른 검사';
    if (mode === 'extend') return '추가 질문';
    return '정밀 검사';
  };

  // 로딩 중이거나 질문이 없으면 로딩 UI 표시
  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-6 sm:mb-8">
            <Stepper
              currentStep={3}
              steps={['기본정보', '상담내용', '성향테스트', '결과']}
            />
          </div>

          <Card>
            <CardContent className="p-8 sm:p-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  맞춤 질문을 준비하고 있어요
                </h2>
                <p className="text-gray-600 text-sm">
                  아이의 정보를 바탕으로 질문을 개인화하고 있습니다...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900 flex items-center gap-2">
            {getModeIcon()}
            {getModeTitle()}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            질문 {currentQuestionIndex + 1} / {totalQuestions}
            {mode === 'extend' && ' (기존 응답 유지됨)'}
          </p>
        </div>

        {/* 질문 카드 */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="mb-6 sm:mb-8">
              {/* 진행률 바 */}
              <div className="relative w-full h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* 질문 */}
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 leading-relaxed">
                {currentQuestion.text}
              </h2>

              {/* 질문 유형에 따른 선택지 */}
              {isQuestionSituation ? (
                /* 상황 판단형 선택 */
                <div className="space-y-2 sm:space-y-3">
                  {currentQuestion.options?.map((option: SituationOption) => (
                    <label
                      key={option.label}
                      className={`
                        flex items-start cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                        ${currentAnswer === option.label
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option.label}
                        checked={currentAnswer === option.label}
                        onChange={() => handleSituationAnswer(option.label as 'A' | 'B' | 'C' | 'D')}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary focus:ring-2 focus:ring-primary mt-0.5"
                      />
                      <div className="ml-3 sm:ml-4">
                        <span className={`
                          text-sm sm:text-base font-bold mr-2
                          ${currentAnswer === option.label ? 'text-primary' : 'text-gray-500'}
                        `}>
                          {option.label}.
                        </span>
                        <span className={`
                          text-sm sm:text-base font-medium
                          ${currentAnswer === option.label ? 'text-primary' : 'text-gray-900'}
                        `}>
                          {option.text}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                /* 5점 척도 선택 */
                <div className="space-y-2 sm:space-y-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label
                      key={value}
                      className={`
                        flex items-center cursor-pointer p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200
                        ${currentAnswer === value
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={value}
                        checked={currentAnswer === value}
                        onChange={() => handleScaleAnswer(value as 1 | 2 | 3 | 4 | 5)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span className={`
                        ml-3 sm:ml-4 text-sm sm:text-base font-medium
                        ${currentAnswer === value ? 'text-primary' : 'text-gray-900'}
                      `}>
                        {SCALE_LABELS[value - 1]}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 데스크톱 버튼 */}
            <div className="hidden sm:flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handlePrevious}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={handleNext}
                disabled={currentAnswer === null}
              >
                {currentQuestionIndex < totalQuestions - 1 ? '다음' : '결과'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 안내 */}
        <div className="text-center flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <p className="text-sm text-gray-500">
            아이의 평소 모습을 떠올리며 솔직하게 답변해주세요
          </p>
        </div>

        {/* 모바일 하단 고정 버튼 */}
        <div className="h-20 sm:hidden" /> {/* 스페이서 */}
      </div>

      {/* 모바일 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg sm:hidden">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handlePrevious}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1"
            onClick={handleNext}
            disabled={currentAnswer === null}
          >
            {currentQuestionIndex < totalQuestions - 1 ? '다음' : '결과'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
