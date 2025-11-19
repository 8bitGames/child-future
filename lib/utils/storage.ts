import { AssessmentResult } from '@/lib/types/result';
import { CategoryScores } from '@/lib/types/result';

const STORAGE_KEY = 'child-future-results';
const MAX_RESULTS = 20; // 최대 저장 개수

// 결과 저장
export function saveResult(result: AssessmentResult): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getResults();
    existing.push(result);

    // 최대 개수 초과 시 오래된 것부터 삭제
    const trimmed = existing.slice(-MAX_RESULTS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save result:', error);
  }
}

// 모든 결과 가져오기
export function getResults(): AssessmentResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get results:', error);
    return [];
  }
}

// 최신 결과 가져오기
export function getLatestResult(): AssessmentResult | null {
  const results = getResults();
  return results.length > 0 ? results[results.length - 1] : null;
}

// ID로 결과 가져오기
export function getResultById(id: string): AssessmentResult | null {
  const results = getResults();
  return results.find(r => r.id === id) || null;
}

// 결과 삭제
export function deleteResult(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getResults();
    const filtered = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete result:', error);
  }
}

// 모든 결과 삭제
export function clearAllResults(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear results:', error);
  }
}

// 두 결과 비교
export function compareResults(currentId: string, previousId: string) {
  const results = getResults();
  const current = results.find(r => r.id === currentId);
  const previous = results.find(r => r.id === previousId);

  if (!current || !previous) return null;

  const scoreDifferences = Object.entries(current.scores).reduce((acc, [key, value]) => {
    const prevValue = previous.scores[key as keyof CategoryScores];
    acc[key] = value - prevValue;
    return acc;
  }, {} as Record<string, number>);

  return {
    current,
    previous,
    scoreDifferences,
    timeDifference: new Date(current.timestamp).getTime() - new Date(previous.timestamp).getTime()
  };
}

// 결과 개수 가져오기
export function getResultCount(): number {
  return getResults().length;
}

// 저장 공간 사용량 확인 (대략적)
export function getStorageSize(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Blob([stored]).size : 0;
  } catch (error) {
    console.error('Failed to get storage size:', error);
    return 0;
  }
}
