import { QuestionResponse, CareerCategory } from '@/lib/types/assessment';
import { CategoryScores } from '@/lib/types/result';
import { ASSESSMENT_QUESTIONS, FULL_ASSESSMENT_QUESTIONS } from '@/lib/data/questions';

// 응답 타입: 배열 또는 객체
type ResponsesInput = QuestionResponse[] | Record<string, number | string>;

// 응답을 바탕으로 직업군별 점수 계산
export function calculateScores(responses: ResponsesInput): CategoryScores {
  const scores: CategoryScores = {
    creative: 0,
    analytical: 0,
    caring: 0,
    leadership: 0,
    practical: 0
  };

  // 객체 형태인 경우 배열로 변환
  let responseArray: QuestionResponse[];

  if (Array.isArray(responses)) {
    responseArray = responses;
  } else {
    // Record<string, number | string> 형태를 QuestionResponse[] 로 변환
    responseArray = Object.entries(responses).map(([key, value]) => ({
      questionId: key,
      value: value as QuestionResponse['value']
    }));
  }

  responseArray.forEach(response => {
    // 전체 질문에서 검색 (척도형 + 상황형)
    const question = FULL_ASSESSMENT_QUESTIONS.find(q => q.id === response.questionId);
    if (!question) return;

    // 상황형 질문인 경우
    if (question.type === 'situation' && question.options) {
      const selectedOption = question.options.find(opt => opt.label === response.value);
      if (selectedOption) {
        // 선택한 옵션의 가중치 적용
        Object.entries(selectedOption.weights).forEach(([category, weight]) => {
          scores[category as keyof CategoryScores] += weight;
        });
      }
    } else {
      // 척도형 질문인 경우 (기본)
      const numericValue = typeof response.value === 'number' ? response.value : 0;
      Object.entries(question.weights).forEach(([category, weight]) => {
        scores[category as keyof CategoryScores] += numericValue * weight;
      });
    }
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

// 최대 가능 점수 계산 (모든 문항에 최고 점수를 준 경우)
export function getMaxPossibleScore(category: CareerCategory): number {
  let maxScore = 0;

  FULL_ASSESSMENT_QUESTIONS.forEach(question => {
    if (question.type === 'situation' && question.options) {
      // 상황형: 해당 카테고리에서 가장 높은 가중치를 가진 옵션의 점수
      const maxOptionWeight = Math.max(
        ...question.options.map(opt => opt.weights[category] || 0)
      );
      maxScore += maxOptionWeight;
    } else {
      // 척도형: 최대 응답 값(5) * 가중치
      const weight = question.weights[category];
      maxScore += 5 * weight;
    }
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
