import { QuestionResponse, CareerCategory } from '@/lib/types/assessment';
import { CategoryScores } from '@/lib/types/result';
import { ASSESSMENT_QUESTIONS } from '@/lib/data/questions';

// 응답을 바탕으로 직업군별 점수 계산
export function calculateScores(responses: QuestionResponse[]): CategoryScores {
  const scores: CategoryScores = {
    creative: 0,
    analytical: 0,
    caring: 0,
    leadership: 0,
    practical: 0
  };

  responses.forEach(response => {
    const question = ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    // 각 문항의 가중치와 응답 값을 곱해서 점수 누적
    Object.entries(question.weights).forEach(([category, weight]) => {
      scores[category as keyof CategoryScores] += response.value * weight;
    });
  });

  return scores;
}

// 상위 N개 직업군 추출
export function getTopCategories(
  scores: CategoryScores,
  count: number = 2
): CareerCategory[] {
  return (Object.entries(scores) as [CareerCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([category]) => category);
}

// 점수를 100점 만점으로 정규화
export function normalizeScores(scores: CategoryScores): CategoryScores {
  const max = Math.max(...Object.values(scores));
  if (max === 0) return scores;

  return Object.entries(scores).reduce((acc, [key, value]) => {
    acc[key as keyof CategoryScores] = Math.round((value / max) * 100);
    return acc;
  }, {} as CategoryScores);
}

// 점수를 백분율로 변환
export function getScorePercentage(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
}

// 최대 가능 점수 계산 (모든 문항에 5점을 준 경우)
export function getMaxPossibleScore(category: CareerCategory): number {
  let maxScore = 0;

  ASSESSMENT_QUESTIONS.forEach(question => {
    const weight = question.weights[category];
    maxScore += 5 * weight; // 최대 응답 값(5) * 가중치
  });

  return maxScore;
}

// 직업군별 상대 점수 (다른 직업군과 비교)
export function getRelativeScores(scores: CategoryScores): Record<CareerCategory, number> {
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  if (total === 0) return scores;

  return Object.entries(scores).reduce((acc, [category, score]) => {
    acc[category as CareerCategory] = Math.round((score / total) * 100);
    return acc;
  }, {} as Record<CareerCategory, number>);
}
