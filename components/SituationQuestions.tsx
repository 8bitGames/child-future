'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SkipButton, OptionalBadge } from '@/components/SkipButton';
import {
  getSituationQuestionsByAge,
  getRandomSituationQuestions
} from '@/lib/data/situation-questions';
import type { SituationQuestion, AgeGroup } from '@/lib/types/ib-enhanced';
import { ArrowLeft, ArrowRight, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface SituationQuestionsProps {
  childAge: number;
  childNickname?: string;
  questionCount?: number;
  onComplete: (responses: SituationResponse[]) => void;
  onSkip?: () => void;
}

export interface SituationResponse {
  questionId: string;
  selectedOptionIndex: number;
  ibWeights: Record<string, number>;
}

/**
 * 연령 그룹 결정
 */
function getAgeGroup(age: number): AgeGroup {
  if (age <= 7) return 'early';
  if (age <= 10) return 'middle';
  return 'late';
}

/**
 * 연령별 UI 설정
 */
const AGE_GROUP_CONFIG = {
  early: {
    title: '그림 이야기',
    description: '그림을 보고 어떻게 하고 싶은지 골라주세요',
    optionStyle: 'large', // 큰 버튼, 시각적 강조
    showEmoji: true
  },
  middle: {
    title: '상황 질문',
    description: '상황을 읽고 가장 하고 싶은 것을 골라주세요',
    optionStyle: 'medium',
    showEmoji: true
  },
  late: {
    title: '상황 판단',
    description: '상황을 읽고 가장 맞는 선택을 해주세요',
    optionStyle: 'compact',
    showEmoji: false
  }
};

/**
 * 옵션 라벨 (A, B, C, D)
 */
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/**
 * 옵션 색상 (선택 시)
 */
const OPTION_COLORS = [
  'border-blue-500 bg-blue-50',
  'border-green-500 bg-green-50',
  'border-purple-500 bg-purple-50',
  'border-orange-500 bg-orange-50'
];

export function SituationQuestions({
  childAge,
  childNickname,
  questionCount = 4,
  onComplete,
  onSkip
}: SituationQuestionsProps) {
  const ageGroup = getAgeGroup(childAge);
  const config = AGE_GROUP_CONFIG[ageGroup];

  // 연령에 맞는 질문 가져오기
  const [questions, setQuestions] = useState<SituationQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    // 랜덤으로 질문 선택 (또는 전체 사용)
    const availableQuestions = getSituationQuestionsByAge(childAge);
    const selectedQuestions = questionCount >= availableQuestions.length
      ? availableQuestions
      : getRandomSituationQuestions(childAge, questionCount);
    setQuestions(selectedQuestions);
  }, [childAge, questionCount]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(responses).length;
  const progress = (answeredCount / totalQuestions) * 100;
  const isComplete = answeredCount === totalQuestions;

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null || !currentQuestion) return;

    // 응답 저장
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption
    }));

    // 다음 질문 또는 완료
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      // 이전 응답 복원
      const prevQuestion = questions[currentIndex - 1];
      setSelectedOption(responses[prevQuestion.id] ?? null);
    }
  };

  const handleComplete = () => {
    if (!isComplete && selectedOption === null) return;

    // 현재 응답도 저장
    let finalResponses = { ...responses };
    if (selectedOption !== null && currentQuestion) {
      finalResponses[currentQuestion.id] = selectedOption;
    }

    // 응답 배열 생성
    const responseArray: SituationResponse[] = questions.map(q => {
      const optionIndex = finalResponses[q.id] ?? 0;
      const option = q.options[optionIndex];
      return {
        questionId: q.id,
        selectedOptionIndex: optionIndex,
        ibWeights: option?.ibWeights || {}
      };
    });

    onComplete(responseArray);
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">질문을 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 진행 상황 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{answeredCount + (selectedOption !== null ? 1 : 0)} / {totalQuestions} 완료</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 질문 네비게이션 */}
      <div className="flex gap-1 flex-wrap">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => {
              // 이전 질문으로만 이동 가능
              if (index < currentIndex || responses[q.id] !== undefined) {
                setCurrentIndex(index);
                setSelectedOption(responses[q.id] ?? null);
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
              ${index === currentIndex
                ? 'bg-primary text-primary-foreground'
                : responses[q.id] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : 'bg-muted text-muted-foreground'
              }
              ${index <= currentIndex || responses[q.id] !== undefined
                ? 'cursor-pointer hover:opacity-80'
                : 'cursor-not-allowed opacity-50'
              }`}
            disabled={index > currentIndex && responses[q.id] === undefined}
          >
            {responses[q.id] !== undefined ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>

      {/* 현재 질문 */}
      {currentQuestion && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg leading-relaxed">
                  {childNickname ? `${childNickname}야, ` : ''}{currentQuestion.scenario}
                </CardTitle>
                <CardDescription className="mt-2">
                  {config.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 선택지 */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all
                    ${selectedOption === index
                      ? `${OPTION_COLORS[index]} ring-2 ring-primary ring-offset-2`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    ${config.optionStyle === 'large' ? 'py-5' : config.optionStyle === 'medium' ? 'py-4' : 'py-3'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      ${selectedOption === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {OPTION_LABELS[index]}
                    </span>
                    <span className={`
                      ${config.optionStyle === 'large' ? 'text-base' : 'text-sm'}
                      ${selectedOption === index ? 'text-gray-900 font-medium' : 'text-gray-700'}
                    `}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* 선택한 옵션 설명 (어린 아이용) */}
            {selectedOption !== null && ageGroup !== 'late' && (
              <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground bg-primary/5 rounded-lg p-3">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <p>{currentQuestion.options[selectedOption]?.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="flex-1"
          >
            다음
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={selectedOption === null}
            className="flex-1"
          >
            완료
            <CheckCircle2 className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* 건너뛰기 */}
      {onSkip && (
        <div className="text-center">
          <SkipButton
            onSkip={onSkip}
            message="상황 질문을 건너뛰면 기본 성향 검사 결과만 제공됩니다."
          />
        </div>
      )}
    </div>
  );
}

/**
 * 상황 질문 결과 요약 컴포넌트
 */
export function SituationResponsesSummary({
  responses,
  questions
}: {
  responses: SituationResponse[];
  questions: SituationQuestion[];
}) {
  const questionMap = new Map(questions.map(q => [q.id, q]));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">상황 질문 응답 요약</h3>
      <div className="grid gap-3">
        {responses.map((response, index) => {
          const question = questionMap.get(response.questionId);
          if (!question) return null;

          const selectedOption = question.options[response.selectedOptionIndex];

          return (
            <div key={response.questionId} className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Q{index + 1}. {question.scenario}
              </p>
              <p className="text-sm text-primary">
                <span className="font-semibold">{OPTION_LABELS[response.selectedOptionIndex]}.</span> {selectedOption?.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
