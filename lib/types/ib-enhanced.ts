/**
 * IB 학습자상 강화 타입 정의
 * PDF "IB 학습자상 상세 분석 및 판별 가이드" 기반
 */

import { IBLearnerProfile } from './assessment';
import { CareerCategory } from './assessment';

// 행동 지표 카테고리
export type BehavioralCategory = 'cognitive' | 'emotional' | 'social' | 'behavioral';

// 관찰 가능 환경
export type ObservationContext = 'home' | 'school' | 'play' | 'social';

// 관찰 빈도
export type ObservationFrequency = 'never' | 'rarely' | 'sometimes' | 'often' | 'always';

// 숙련도 레벨
export type ProficiencyLevel = 'expert' | 'proficient' | 'novice';
export type ProficiencyLevelKo = '숙련' | '능숙' | '초보';

// 평가 질문 유형
export type AssessmentQuestionType = 'observation' | 'interview' | 'situation';

// 관찰자 유형
export type ObserverType = 'parent' | 'teacher' | 'both';

// 연령 그룹
export type AgeGroup = 'early' | 'middle' | 'late';
export type AgeRange = '5-7' | '8-10' | '11-14';

/**
 * 행동 지표 인터페이스
 * 각 IB 프로필의 관찰 가능한 행동 특성
 */
export interface BehavioralIndicator {
  id: string;
  category: BehavioralCategory;
  indicator: string;
  childVersion: string;  // 아동용 쉬운 표현
  observableIn: ObservationContext[];
}

/**
 * 관찰 루브릭 인터페이스
 * 3단계 숙련도 평가 기준
 */
export interface ObservationRubric {
  level: ProficiencyLevel;
  levelKo: ProficiencyLevelKo;
  description: string;
  childDescription: string;
  examples: string[];
}

/**
 * 평가 질문 인터페이스
 * STAR 기반 상황 질문
 */
export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  question: string;
  childAdapted: string;  // 아동용 적응 버전
  followUp: string[];
  targetAge: { min: number; max: number };
  forObserver: ObserverType;
}

/**
 * 비즈니스/미래 역량 인터페이스
 * IB 프로필과 미래 진로 연계
 */
export interface BusinessCompetency {
  competency: string;
  competencyKo: string;
  description: string;
  futureRelevance: string;  // 미래 진로 연관성
  relatedCareers: string[];
}

/**
 * 연령별 적응 콘텐츠
 */
export interface AgeAdaptation {
  age: AgeRange;
  ageGroup: AgeGroup;
  indicators: string[];
  activities: string[];
  communicationStyle: string;
}

/**
 * 이론적 배경
 */
export interface TheoreticalBasis {
  coreEssence: string;
  psychologicalFoundation: string;
  developmentalImportance: string;
  keyResearchers?: string[];
}

/**
 * 강화된 IB 프로필 인터페이스
 * 기존 IB 프로필에 PDF 기반 상세 정보 추가
 */
export interface EnhancedIBProfile {
  id: IBLearnerProfile;
  nameKo: string;
  nameEn: string;
  icon: string;

  // 기존 필드 (유지)
  definition: string;
  definitionEn: string;
  characteristics: string[];
  relatedCategories: CareerCategory[];
  educationMethods: {
    parentGuide: string[];
    teacherGuide: string[];
    activities: string[];
    avoidBehaviors: string[];
  };

  // 신규 필드 (PDF 기반)
  theoreticalBasis: TheoreticalBasis;
  behavioralIndicators: BehavioralIndicator[];
  observationRubrics: ObservationRubric[];
  assessmentQuestions: AssessmentQuestion[];
  businessCompetencies: BusinessCompetency[];

  // 아동 발달 단계별 적응
  ageAdaptations: {
    early: AgeAdaptation;   // 5-7세
    middle: AgeAdaptation;  // 8-10세
    late: AgeAdaptation;    // 11-14세
  };
}

/**
 * 관찰 체크리스트 항목
 */
export interface ObservationItem {
  id: string;
  profileTarget: IBLearnerProfile[];
  question: string;
  frequency: ObservationFrequency;
  context: 'home' | 'school' | 'both';
  ageRange: { min: number; max: number };
  weight?: number;  // 가중치 (기본 1)
}

/**
 * 상황 질문 옵션
 */
export interface SituationQuestionOption {
  text: string;
  ibWeights: Partial<Record<IBLearnerProfile, number>>;
  explanation?: string;  // 선택 이유 설명 (결과용)
}

/**
 * 연령별 상황 질문
 */
export interface SituationQuestion {
  id: string;
  ageGroup: AgeGroup;
  scenario: string;
  visualSupport?: string;  // 이미지 경로 (어린 아이용)
  options: SituationQuestionOption[];
  category?: CareerCategory[];  // 관련 직업군
}

/**
 * IB 프로필 평가 결과
 */
export interface IBProfileScore {
  profile: IBLearnerProfile;
  score: number;
  level: ProficiencyLevel;
  levelKo: ProficiencyLevelKo;
  observedIndicators: string[];
  recommendedActivities: string[];
}

/**
 * 통합 IB 평가 결과
 */
export interface IBAssessmentResult {
  topProfiles: IBProfileScore[];  // 상위 2-3개
  allScores: Record<IBLearnerProfile, number>;
  observationSummary?: {
    completedBy: ObserverType;
    totalItems: number;
    completedItems: number;
  };
  ageGroup: AgeGroup;
  assessmentDate: string;
}

/**
 * 진로-IB 심층 매핑
 */
export interface CareerIBMapping {
  category: CareerCategory;
  categoryKo: string;
  primaryProfiles: IBLearnerProfile[];
  secondaryProfiles: IBLearnerProfile[];
  competencies: string[];
  futureFields: string[];
  activities: string[];
}
