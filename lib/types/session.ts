/**
 * 세션 및 검사 흐름 관련 타입 정의
 */

import { BasicInfo, QuestionResponse, AssessmentMode } from './assessment';
import { ParentProfile, ObservationResponse } from './parent';
import { IBAssessmentResult, AgeGroup } from './ib-enhanced';
import { ParentGuide, TeacherGuide } from './guide';
import { ActivityRecommendation } from './activity';

/**
 * 참여자 유형
 */
export type ParticipantType = 'parent' | 'teacher' | 'both';

export const PARTICIPANT_TYPE_NAMES: Record<ParticipantType, string> = {
  parent: '부모님',
  teacher: '선생님',
  both: '부모님과 선생님'
};

/**
 * 상담 모드
 */
export type ConsultationMode =
  | 'career-exploration'  // 진로 탐색
  | 'trait-analysis'      // 성향 분석
  | 'learning-style'      // 학습 스타일
  | 'comprehensive';      // 종합 상담

export const CONSULTATION_MODE_NAMES: Record<ConsultationMode, string> = {
  'career-exploration': '진로 탐색',
  'trait-analysis': '성향 분석',
  'learning-style': '학습 스타일',
  comprehensive: '종합 상담'
};

/**
 * 검사 단계
 */
export type AssessmentStep =
  | 'participant-select'    // 참여자 선택
  | 'parent-info'          // 부모 정보 (선택)
  | 'parent-survey'        // 부모 설문 (선택)
  | 'observation'          // 관찰 체크리스트 (선택)
  | 'child-info'           // 아이 정보
  | 'consultation-mode'    // 상담 모드 선택
  | 'assessment'           // 성향 검사
  | 'situation-questions'  // 상황 질문 (선택)
  | 'analyzing'            // 분석 중
  | 'results';             // 결과

export const ASSESSMENT_STEP_NAMES: Record<AssessmentStep, string> = {
  'participant-select': '참여자 선택',
  'parent-info': '부모 정보',
  'parent-survey': '부모 설문',
  observation: '관찰 체크리스트',
  'child-info': '아이 정보',
  'consultation-mode': '상담 모드',
  assessment: '성향 검사',
  'situation-questions': '상황 질문',
  analyzing: '분석 중',
  results: '결과'
};

/**
 * 단계별 필수/선택 정보
 */
export interface StepConfig {
  step: AssessmentStep;
  required: boolean;
  skippable: boolean;
  skipMessage?: string;
  estimatedTime?: string;  // 예상 소요 시간
}

/**
 * 세션 상태
 */
export type SessionStatus =
  | 'in-progress'
  | 'completed'
  | 'abandoned'
  | 'error';

/**
 * 검사 세션
 */
export interface AssessmentSession {
  // 식별자
  id: string;
  createdAt: string;
  updatedAt: string;
  status: SessionStatus;

  // 참여자 정보
  participantType: ParticipantType;

  // 검사 설정
  assessmentMode: AssessmentMode;
  consultationMode?: ConsultationMode;

  // 진행 상태
  currentStep: AssessmentStep;
  completedSteps: AssessmentStep[];
  skippedSteps: AssessmentStep[];

  // 수집된 데이터
  childInfo?: BasicInfo;
  parentProfile?: ParentProfile;
  observationData?: ObservationResponse;
  questionResponses?: QuestionResponse[];
  situationResponses?: {
    questionId: string;
    selectedOption: number;
  }[];

  // 추가 피드백
  schoolFeedback?: string;
  academyFeedback?: string;

  // 결과 (분석 완료 시)
  results?: SessionResults;
}

/**
 * 세션 결과
 */
export interface SessionResults {
  // 생성 정보
  generatedAt: string;
  analysisVersion: string;

  // IB 프로필 분석
  ibAssessment: IBAssessmentResult;

  // 직업군 분석
  careerAnalysis: {
    topCategories: {
      category: string;
      categoryKo: string;
      score: number;
      description: string;
    }[];
    recommendedCareers: {
      name: string;
      description: string;
      matchScore: number;
    }[];
  };

  // AI 생성 인사이트
  aiInsights: {
    summary: string;
    strengths: string[];
    growthAreas: string[];
    uniqueTraits: string[];
  };

  // 가이드
  parentGuide?: ParentGuide;
  teacherGuide?: TeacherGuide;

  // 활동 추천
  activityRecommendations?: ActivityRecommendation[];

  // 이전 결과와 비교 (있는 경우)
  comparison?: {
    previousSessionId: string;
    previousDate: string;
    changes: {
      area: string;
      previousValue: number;
      currentValue: number;
      change: 'improved' | 'declined' | 'stable';
    }[];
    insights: string[];
  };
}

/**
 * 세션 이력 (저장용)
 */
export interface SessionHistory {
  id: string;
  childNickname: string;
  childAge: number;
  completedAt: string;
  assessmentMode: AssessmentMode;
  consultationMode?: ConsultationMode;
  topProfiles: string[];
  topCategories: string[];
  participantType: ParticipantType;
}

/**
 * 세션 비교 요청
 */
export interface SessionCompareRequest {
  sessionId1: string;
  sessionId2: string;
}

/**
 * 세션 비교 결과
 */
export interface SessionCompareResult {
  session1: SessionHistory;
  session2: SessionHistory;
  timeDiff: string;  // 예: "3개월"
  profileChanges: {
    profile: string;
    session1Score: number;
    session2Score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  categoryChanges: {
    category: string;
    session1Score: number;
    session2Score: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  insights: string[];
  recommendations: string[];
}

/**
 * 진행 상태 (UI용)
 */
export interface ProgressState {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  stepName: string;
  isOptionalStep: boolean;
  canSkip: boolean;
  canGoBack: boolean;
}

/**
 * 단계 전환 액션
 */
export type StepAction =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SKIP' }
  | { type: 'GO_TO'; step: AssessmentStep }
  | { type: 'COMPLETE' }
  | { type: 'RESTART' };

/**
 * 세션 저장 데이터 (localStorage용)
 */
export interface StoredSession {
  session: AssessmentSession;
  results?: SessionResults;
  savedAt: string;
  expiresAt?: string;
}

/**
 * 사용자 세션 목록
 */
export interface UserSessionList {
  sessions: SessionHistory[];
  lastUpdated: string;
  totalCount: number;
}
