/**
 * 부모 프로필 관련 타입 정의
 * 선택적(Optional) 부모 정보 수집용
 */

import { IBLearnerProfile } from './assessment';

/**
 * 양육 스타일 (Baumrind's Parenting Styles)
 */
export type ParentingStyle =
  | 'authoritative'    // 권위적 (민주적) - 높은 반응성, 높은 요구
  | 'authoritarian'    // 독재적 - 낮은 반응성, 높은 요구
  | 'permissive'       // 허용적 - 높은 반응성, 낮은 요구
  | 'uninvolved';      // 무관심 - 낮은 반응성, 낮은 요구

export const PARENTING_STYLE_NAMES: Record<ParentingStyle, string> = {
  authoritative: '민주적 양육',
  authoritarian: '권위적 양육',
  permissive: '허용적 양육',
  uninvolved: '방임적 양육'
};

/**
 * 부모의 교육 목표
 */
export type EducationGoal =
  | 'academic'        // 학업 성취
  | 'creativity'      // 창의성 발달
  | 'social'          // 사회성 발달
  | 'independence'    // 자립심/독립심
  | 'happiness'       // 행복/정서 안정
  | 'values'          // 인성/가치관
  | 'health';         // 건강/체력

export const EDUCATION_GOAL_NAMES: Record<EducationGoal, string> = {
  academic: '학업 성취',
  creativity: '창의성 발달',
  social: '사회성 발달',
  independence: '자립심 키우기',
  happiness: '행복한 아이',
  values: '바른 인성',
  health: '건강한 체력'
};

/**
 * 교육 관심사
 */
export type EducationInterest =
  | 'stem'           // 과학/수학/기술
  | 'arts'           // 예술/음악/미술
  | 'sports'         // 스포츠/체육
  | 'language'       // 언어/외국어
  | 'social-studies' // 사회/역사
  | 'nature'         // 자연/환경
  | 'tech';          // IT/디지털

export const EDUCATION_INTEREST_NAMES: Record<EducationInterest, string> = {
  stem: '과학/수학/기술',
  arts: '예술/음악/미술',
  sports: '스포츠/체육',
  language: '언어/외국어',
  'social-studies': '사회/역사',
  nature: '자연/환경',
  tech: 'IT/디지털'
};

/**
 * 아이 강점 (부모 관점)
 */
export type ChildStrength =
  | 'curiosity'       // 호기심
  | 'creativity'      // 창의력
  | 'persistence'     // 끈기
  | 'empathy'         // 공감능력
  | 'leadership'      // 리더십
  | 'communication'   // 의사소통
  | 'logical'         // 논리적 사고
  | 'artistic'        // 예술적 감각
  | 'physical'        // 운동 능력
  | 'focus';          // 집중력

export const CHILD_STRENGTH_NAMES: Record<ChildStrength, string> = {
  curiosity: '호기심이 많음',
  creativity: '창의력이 뛰어남',
  persistence: '끈기가 있음',
  empathy: '공감능력이 좋음',
  leadership: '리더십이 있음',
  communication: '말을 잘함',
  logical: '논리적으로 생각함',
  artistic: '예술적 감각이 있음',
  physical: '운동을 잘함',
  focus: '집중력이 좋음'
};

/**
 * 발전 영역 (부모 관점)
 */
export type GrowthArea =
  | 'confidence'      // 자신감
  | 'social-skills'   // 사회성
  | 'patience'        // 인내심
  | 'independence'    // 독립심
  | 'organization'    // 정리정돈
  | 'focus'           // 집중력
  | 'expression'      // 감정표현
  | 'listening';      // 경청

export const GROWTH_AREA_NAMES: Record<GrowthArea, string> = {
  confidence: '자신감',
  'social-skills': '사회성',
  patience: '인내심',
  independence: '독립심',
  organization: '정리정돈',
  focus: '집중력',
  expression: '감정표현',
  listening: '경청'
};

/**
 * 양육 고민
 */
export type ParentingConcern =
  | 'screen-time'     // 미디어/스크린 타임
  | 'peer-relations'  // 또래 관계
  | 'study-habits'    // 학습 습관
  | 'emotional'       // 정서/감정 조절
  | 'motivation'      // 동기부여
  | 'sibling'         // 형제 관계
  | 'behavior'        // 행동 문제
  | 'health';         // 건강/체력

export const PARENTING_CONCERN_NAMES: Record<ParentingConcern, string> = {
  'screen-time': '미디어/스마트폰 사용',
  'peer-relations': '친구 관계',
  'study-habits': '학습 습관',
  emotional: '감정 조절',
  motivation: '동기부여',
  sibling: '형제자매 관계',
  behavior: '행동 문제',
  health: '건강/체력'
};

/**
 * 부모 설문 응답
 */
export interface ParentSurveyResponse {
  questionId: string;
  value: number | string | string[];
}

/**
 * 부모 프로필 (선택적)
 */
export interface ParentProfile {
  // 기본 정보 (선택)
  relationship?: 'mother' | 'father' | 'guardian' | 'teacher';

  // 교육 목표 (최대 3개)
  educationGoals: EducationGoal[];

  // 교육 관심 분야 (최대 3개)
  educationInterests: EducationInterest[];

  // 아이 강점 (부모 관점, 최대 3개)
  perceivedStrengths: ChildStrength[];

  // 발전 영역 (최대 2개)
  growthAreas: GrowthArea[];

  // 양육 고민 (최대 2개)
  concerns: ParentingConcern[];

  // 양육 스타일 (설문 기반 자동 분류)
  parentingStyle?: ParentingStyle;

  // 추가 메모 (자유 입력)
  additionalNotes?: string;
}

/**
 * 부모 설문 결과
 */
export interface ParentSurveyResult {
  parentingStyle: ParentingStyle;
  styleDescription: string;
  recommendations: string[];
  communicationTips: string[];
}

/**
 * 부모-아이 매칭 분석
 */
export interface ParentChildMatch {
  alignmentScore: number;  // 0-100
  alignedAreas: string[];
  potentialConflicts: string[];
  suggestions: string[];
  ibProfileRecommendations: {
    profile: IBLearnerProfile;
    reason: string;
    activities: string[];
  }[];
}

/**
 * 관찰 체크리스트 응답 (부모/교사용)
 */
export interface ObservationResponse {
  observerId?: string;
  observerType: 'parent' | 'teacher';
  childAge: number;
  responses: {
    itemId: string;
    frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
    note?: string;
  }[];
  completedAt: string;
}
