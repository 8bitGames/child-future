'use client';

import { Button } from '@/components/ui/button';
import { SkipForward, Info } from 'lucide-react';

interface SkipButtonProps {
  onSkip: () => void;
  message?: string;
  className?: string;
}

/**
 * 건너뛰기 버튼 컴포넌트
 * 선택적 단계에서 사용
 */
export function SkipButton({ onSkip, message, className = '' }: SkipButtonProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        type="button"
        variant="ghost"
        onClick={onSkip}
        className="text-muted-foreground hover:text-foreground"
      >
        <SkipForward className="w-4 h-4 mr-2" />
        이 단계 건너뛰기
      </Button>

      {message && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

/**
 * 선택적 단계 표시 배지
 */
export function OptionalBadge() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
      선택
    </span>
  );
}
