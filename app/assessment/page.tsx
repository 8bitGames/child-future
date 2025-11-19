'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { QuestionResponse } from '@/lib/types/assessment';
import { ASSESSMENT_QUESTIONS, SCALE_LABELS } from '@/lib/data/questions';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  useEffect(() => {
    // 이전 단계 데이터 확인
    const basicInfo = sessionStorage.getItem('basicInfo');
    const consultation = sessionStorage.getItem('consultation');
    if (!basicInfo || !consultation) {
      router.push('/basic-info');
    }
  }, [router]);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = (value: 1 | 2 | 3 | 4 | 5) => {
    setCurrentAnswer(value);
  };

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
      sessionStorage.setItem('responses', JSON.stringify(updatedResponses));
      router.push('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // 이전 답변 복원
      const previousResponse = responses[currentQuestionIndex - 1];
      setCurrentAnswer(previousResponse?.value || null);
      // 응답 배열에서 현재 답변 제거
      setResponses(responses.slice(0, -1));
    } else {
      router.push('/consultation');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* 진행 단계 */}
        <div className="mb-8">
          <Progress
            currentStep={3}
            totalSteps={4}
            steps={['기본정보', '상담내용', '성향테스트', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">성향 테스트</h1>
          <p className="text-gray-600">
            질문 {currentQuestionIndex + 1} / {totalQuestions}
          </p>
        </div>

        {/* 질문 카드 */}
        <Card className="mb-6">
          <div className="mb-8">
            {/* 진행률 바 */}
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 질문 */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* 5점 척도 선택 */}
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <label
                  key={value}
                  className={`
                    flex items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
                    ${currentAnswer === value
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={value}
                    checked={currentAnswer === value}
                    onChange={() => handleAnswer(value as 1 | 2 | 3 | 4 | 5)}
                    className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className={`
                    ml-4 text-base font-medium
                    ${currentAnswer === value ? 'text-blue-900' : 'text-gray-900'}
                  `}>
                    {SCALE_LABELS[value - 1]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handlePrevious}
            >
              ← 이전
            </Button>
            <Button
              type="button"
              fullWidth
              onClick={handleNext}
              disabled={currentAnswer === null}
            >
              {currentQuestionIndex < totalQuestions - 1 ? '다음 →' : '결과 보기 →'}
            </Button>
          </div>
        </Card>

        {/* 안내 */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            💡 아이의 평소 모습을 떠올리며 솔직하게 답변해주세요
          </p>
        </div>
      </div>
    </div>
  );
}
