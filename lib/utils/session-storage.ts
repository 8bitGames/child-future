/**
 * 세션 저장소 유틸리티
 * sessionStorage: 현재 진행 중인 검사 데이터
 * localStorage: 완료된 세션 이력
 */

import { BasicInfo } from '@/lib/types/assessment';
import { ObservationFrequency } from '@/lib/types/ib-enhanced';
import {
  AssessmentSession,
  SessionHistory,
  StoredSession,
  AssessmentStep,
  SessionStatus,
  ParticipantType,
  ConsultationMode
} from '@/lib/types/session';

// Storage Keys
const KEYS = {
  // sessionStorage (현재 세션)
  BASIC_INFO: 'basicInfo',
  PARENT_OBSERVATION: 'parentObservation',
  CONSULTATION_MODE: 'consultationMode',
  QUESTION_RESPONSES: 'questionResponses',
  SITUATION_RESPONSES: 'situationResponses',
  CURRENT_SESSION: 'currentSession',

  // localStorage (영구 저장)
  SESSION_HISTORY: 'child-future-sessions',
  USER_PREFERENCES: 'child-future-preferences'
} as const;

const MAX_HISTORY = 50;

// ==================== Session Storage (현재 세션) ====================

/**
 * 기본 정보 저장
 */
export function saveBasicInfo(info: BasicInfo): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEYS.BASIC_INFO, JSON.stringify(info));
  } catch (error) {
    console.error('Failed to save basic info:', error);
  }
}

/**
 * 기본 정보 가져오기
 */
export function getBasicInfo(): BasicInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(KEYS.BASIC_INFO);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get basic info:', error);
    return null;
  }
}

/**
 * 관찰 응답 인터페이스
 */
export interface ParentObservationData {
  skipped: boolean;
  observerType: 'parent' | 'teacher' | null;
  checklistMode?: 'quick' | 'full';
  responses: {
    itemId: string;
    frequency: ObservationFrequency;
  }[];
  completedAt?: string;
}

/**
 * 부모/교사 관찰 데이터 저장
 */
export function saveParentObservation(data: ParentObservationData): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEYS.PARENT_OBSERVATION, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save parent observation:', error);
  }
}

/**
 * 부모/교사 관찰 데이터 가져오기
 */
export function getParentObservation(): ParentObservationData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(KEYS.PARENT_OBSERVATION);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get parent observation:', error);
    return null;
  }
}

/**
 * 상담 모드 저장
 */
export function saveConsultationMode(mode: ConsultationMode): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEYS.CONSULTATION_MODE, mode);
  } catch (error) {
    console.error('Failed to save consultation mode:', error);
  }
}

/**
 * 상담 모드 가져오기
 */
export function getConsultationMode(): ConsultationMode | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(KEYS.CONSULTATION_MODE) as ConsultationMode | null;
  } catch (error) {
    console.error('Failed to get consultation mode:', error);
    return null;
  }
}

/**
 * 질문 응답 저장
 */
export function saveQuestionResponses(responses: { questionId: string; score: number }[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEYS.QUESTION_RESPONSES, JSON.stringify(responses));
  } catch (error) {
    console.error('Failed to save question responses:', error);
  }
}

/**
 * 질문 응답 가져오기
 */
export function getQuestionResponses(): { questionId: string; score: number }[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(KEYS.QUESTION_RESPONSES);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get question responses:', error);
    return null;
  }
}

/**
 * 상황 질문 응답 저장
 */
export function saveSituationResponses(responses: { questionId: string; selectedOption: number }[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEYS.SITUATION_RESPONSES, JSON.stringify(responses));
  } catch (error) {
    console.error('Failed to save situation responses:', error);
  }
}

/**
 * 상황 질문 응답 가져오기
 */
export function getSituationResponses(): { questionId: string; selectedOption: number }[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(KEYS.SITUATION_RESPONSES);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get situation responses:', error);
    return null;
  }
}

/**
 * 현재 세션 전체 데이터 가져오기
 */
export function getCurrentSessionData() {
  return {
    basicInfo: getBasicInfo(),
    parentObservation: getParentObservation(),
    consultationMode: getConsultationMode(),
    questionResponses: getQuestionResponses(),
    situationResponses: getSituationResponses()
  };
}

/**
 * 현재 세션 데이터 초기화
 */
export function clearCurrentSession(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(KEYS.BASIC_INFO);
    sessionStorage.removeItem(KEYS.PARENT_OBSERVATION);
    sessionStorage.removeItem(KEYS.CONSULTATION_MODE);
    sessionStorage.removeItem(KEYS.QUESTION_RESPONSES);
    sessionStorage.removeItem(KEYS.SITUATION_RESPONSES);
    sessionStorage.removeItem(KEYS.CURRENT_SESSION);
  } catch (error) {
    console.error('Failed to clear current session:', error);
  }
}

// ==================== Local Storage (세션 이력) ====================

/**
 * 세션 이력 저장
 */
export function saveSessionHistory(session: SessionHistory): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSessionHistoryList();
    existing.push(session);

    // 최대 개수 초과 시 오래된 것부터 삭제
    const trimmed = existing.slice(-MAX_HISTORY);
    localStorage.setItem(KEYS.SESSION_HISTORY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to save session history:', error);
  }
}

/**
 * 세션 이력 목록 가져오기
 */
export function getSessionHistoryList(): SessionHistory[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEYS.SESSION_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get session history:', error);
    return [];
  }
}

/**
 * ID로 세션 이력 가져오기
 */
export function getSessionHistoryById(id: string): SessionHistory | null {
  const sessions = getSessionHistoryList();
  return sessions.find(s => s.id === id) || null;
}

/**
 * 특정 아이의 세션 이력 가져오기
 */
export function getSessionHistoryByChild(nickname: string): SessionHistory[] {
  const sessions = getSessionHistoryList();
  return sessions.filter(s => s.childNickname === nickname);
}

/**
 * 최신 세션 이력 가져오기
 */
export function getLatestSessionHistory(): SessionHistory | null {
  const sessions = getSessionHistoryList();
  return sessions.length > 0 ? sessions[sessions.length - 1] : null;
}

/**
 * 세션 이력 삭제
 */
export function deleteSessionHistory(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSessionHistoryList();
    const filtered = existing.filter(s => s.id !== id);
    localStorage.setItem(KEYS.SESSION_HISTORY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete session history:', error);
  }
}

/**
 * 모든 세션 이력 삭제
 */
export function clearAllSessionHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(KEYS.SESSION_HISTORY);
  } catch (error) {
    console.error('Failed to clear session history:', error);
  }
}

// ==================== 유틸리티 함수 ====================

/**
 * 고유 ID 생성
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 새 세션 시작
 */
export function startNewSession(participantType: ParticipantType = 'parent'): AssessmentSession {
  const session: AssessmentSession = {
    id: generateSessionId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'in-progress',
    participantType,
    assessmentMode: 'quick',
    currentStep: 'child-info',
    completedSteps: [],
    skippedSteps: []
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(session));
  }

  return session;
}

/**
 * 현재 세션 업데이트
 */
export function updateCurrentSession(updates: Partial<AssessmentSession>): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = sessionStorage.getItem(KEYS.CURRENT_SESSION);
    if (stored) {
      const session = JSON.parse(stored) as AssessmentSession;
      const updated = {
        ...session,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      sessionStorage.setItem(KEYS.CURRENT_SESSION, JSON.stringify(updated));
    }
  } catch (error) {
    console.error('Failed to update current session:', error);
  }
}

/**
 * 현재 세션 가져오기
 */
export function getCurrentSession(): AssessmentSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(KEYS.CURRENT_SESSION);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get current session:', error);
    return null;
  }
}

/**
 * 세션 완료 처리
 */
export function completeSession(
  topProfiles: string[],
  topCategories: string[]
): SessionHistory | null {
  const session = getCurrentSession();
  const basicInfo = getBasicInfo();

  if (!session || !basicInfo) return null;

  const history: SessionHistory = {
    id: session.id,
    childNickname: basicInfo.nickname,
    childAge: basicInfo.age,
    completedAt: new Date().toISOString(),
    assessmentMode: session.assessmentMode,
    consultationMode: session.consultationMode,
    topProfiles,
    topCategories,
    participantType: session.participantType
  };

  saveSessionHistory(history);
  updateCurrentSession({ status: 'completed' });

  return history;
}

/**
 * 세션 포기 처리
 */
export function abandonSession(): void {
  updateCurrentSession({ status: 'abandoned' });
  clearCurrentSession();
}

/**
 * 저장 공간 사용량 확인
 */
export function getStorageUsage(): { session: number; local: number } {
  if (typeof window === 'undefined') return { session: 0, local: 0 };

  let sessionSize = 0;
  let localSize = 0;

  try {
    // Session storage size
    for (const key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        sessionSize += new Blob([sessionStorage.getItem(key) || '']).size;
      }
    }

    // Local storage size for our keys
    const historyData = localStorage.getItem(KEYS.SESSION_HISTORY);
    if (historyData) {
      localSize += new Blob([historyData]).size;
    }
  } catch (error) {
    console.error('Failed to calculate storage usage:', error);
  }

  return { session: sessionSize, local: localSize };
}

/**
 * 아이 나이에 따른 연령 그룹 결정
 */
export function getAgeGroup(age: number): 'early' | 'middle' | 'late' {
  if (age <= 7) return 'early';
  if (age <= 10) return 'middle';
  return 'late';
}

/**
 * 아이 정보 유효성 검사
 */
export function validateBasicInfo(info: BasicInfo): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!info.nickname?.trim()) {
    errors.push('아이의 애칭을 입력해주세요');
  }

  if (!info.age || info.age < 1 || info.age > 100) {
    errors.push('올바른 나이를 입력해주세요');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
