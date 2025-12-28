'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  getChecklistByAge,
  getQuickChecklist,
  FREQUENCY_LABELS_KO,
  type ObservationItem
} from '@/lib/data/observation-checklist';
import { ObservationFrequency } from '@/lib/types/ib-enhanced';
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react';

interface ObservationChecklistProps {
  childAge: number;
  mode?: 'quick' | 'full';
  observerType: 'parent' | 'teacher';
  onComplete: (responses: ObservationResponse[]) => void;
  onSkip?: () => void;
}

interface ObservationResponse {
  itemId: string;
  frequency: ObservationFrequency;
}

const FREQUENCY_OPTIONS: { value: ObservationFrequency; label: string; color: string }[] = [
  { value: 'never', label: '전혀', color: 'bg-gray-100 text-gray-600 hover:bg-gray-200' },
  { value: 'rarely', label: '거의 안 함', color: 'bg-red-50 text-red-600 hover:bg-red-100' },
  { value: 'sometimes', label: '가끔', color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
  { value: 'often', label: '자주', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { value: 'always', label: '항상', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
];

export function ObservationChecklist({
  childAge,
  mode = 'quick',
  observerType,
  onComplete,
  onSkip
}: ObservationChecklistProps) {
  // 연령과 모드에 따른 체크리스트 가져오기
  const items = mode === 'quick'
    ? getQuickChecklist().filter(item => childAge >= item.ageRange.min && childAge <= item.ageRange.max)
    : getChecklistByAge(childAge);

  const [responses, setResponses] = useState<Record<string, ObservationFrequency>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const answeredCount = Object.keys(responses).length;
  const progress = (answeredCount / items.length) * 100;
  const isComplete = answeredCount === items.length;

  const handleSelect = (itemId: string, frequency: ObservationFrequency) => {
    setResponses(prev => ({ ...prev, [itemId]: frequency }));

    // 자동으로 다음 질문으로 이동 (마지막이 아닌 경우)
    if (currentIndex < items.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const handleComplete = () => {
    const responseArray: ObservationResponse[] = Object.entries(responses).map(([itemId, frequency]) => ({
      itemId,
      frequency
    }));
    onComplete(responseArray);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="space-y-6">
      {/* 진행 상황 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{answeredCount} / {items.length} 완료</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 질문 네비게이션 */}
      <div className="flex gap-1 flex-wrap">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
              ${index === currentIndex
                ? 'bg-primary text-primary-foreground'
                : responses[item.id]
                  ? 'bg-green-100 text-green-700'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            {responses[item.id] ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>

      {/* 현재 질문 */}
      {currentItem && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">{currentIndex + 1}</span>
              </div>
              <div>
                <CardTitle className="text-lg leading-relaxed">
                  {currentItem.question}
                </CardTitle>
                <CardDescription className="mt-1">
                  {observerType === 'parent' ? '가정에서' : '학교에서'} 관찰되는 빈도를 선택해주세요
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {FREQUENCY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(currentItem.id, option.value)}
                  className={`py-3 px-2 rounded-lg text-center transition-all text-sm font-medium
                    ${responses[currentItem.id] === option.value
                      ? `${option.color} ring-2 ring-primary ring-offset-2`
                      : `${option.color}`
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 도움말 */}
            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p><strong>전혀:</strong> 관찰된 적 없음</p>
                <p><strong>거의 안 함:</strong> 드물게 (월 1-2회)</p>
                <p><strong>가끔:</strong> 때때로 (주 1-2회)</p>
                <p><strong>자주:</strong> 빈번하게 (주 3-4회)</p>
                <p><strong>항상:</strong> 거의 매일</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 네비게이션 버튼 */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          이전
        </Button>

        {currentIndex < items.length - 1 ? (
          <Button
            onClick={() => setCurrentIndex(prev => prev + 1)}
            disabled={!responses[currentItem?.id]}
            className="flex-1"
          >
            다음
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!isComplete}
            className="flex-1"
          >
            {isComplete ? '완료' : `${items.length - answeredCount}개 남음`}
          </Button>
        )}
      </div>

      {/* 건너뛰기 */}
      {onSkip && (
        <div className="text-center">
          <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
            체크리스트 건너뛰기
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * 관찰 결과 요약 컴포넌트
 */
export function ObservationSummary({
  responses,
  items
}: {
  responses: ObservationResponse[];
  items: ObservationItem[];
}) {
  const responseMap = new Map(responses.map(r => [r.itemId, r.frequency]));

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">관찰 체크리스트 요약</h3>
      <div className="grid gap-2">
        {items.map(item => {
          const frequency = responseMap.get(item.id);
          if (!frequency) return null;

          return (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
              <span className="text-sm text-muted-foreground">{item.question}</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded
                ${frequency === 'always' || frequency === 'often' ? 'bg-green-100 text-green-700' : ''}
                ${frequency === 'sometimes' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${frequency === 'rarely' || frequency === 'never' ? 'bg-gray-100 text-gray-600' : ''}
              `}>
                {FREQUENCY_LABELS_KO[frequency]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
