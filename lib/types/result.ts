import { CareerCategory, BasicInfo } from './assessment';

// Re-export for convenience
export type { CareerCategory };

// 직업군별 점수
export interface CategoryScores {
  creative: number;
  analytical: number;
  caring: number;
  leadership: number;
  practical: number;
}

// 직업 추천
export interface JobRecommendation {
  title: string;
  category: CareerCategory;
  description: string;
  icon?: string;
}

// 전공 추천
export interface MajorRecommendation {
  name: string;
  category: CareerCategory;
  universities?: string[];
}

// IB 학습자상 10가지
export type IBProfile =
  | 'Inquirer'      // 탐구하는 사람
  | 'Knowledgeable' // 지식이 풍부한 사람
  | 'Thinker'       // 사고하는 사람
  | 'Communicator'  // 소통하는 사람
  | 'Principled'    // 원칙을 지키는 사람
  | 'Open-minded'   // 열린 마음을 가진 사람
  | 'Caring'        // 배려하는 사람
  | 'Risk-taker'    // 도전하는 사람
  | 'Balanced'      // 균형잡힌 사람
  | 'Reflective';   // 성찰하는 사람

// IB 프로필 한글 매핑
export const IB_PROFILE_NAMES: Record<IBProfile, string> = {
  'Inquirer': '탐구하는 사람',
  'Knowledgeable': '지식이 풍부한 사람',
  'Thinker': '사고하는 사람',
  'Communicator': '소통하는 사람',
  'Principled': '원칙을 지키는 사람',
  'Open-minded': '열린 마음을 가진 사람',
  'Caring': '배려하는 사람',
  'Risk-taker': '도전하는 사람',
  'Balanced': '균형잡힌 사람',
  'Reflective': '성찰하는 사람'
};

// 상담 모드 4가지
export type ConsultationMode =
  | 'parent-to-child'      // 부모 → 아이
  | 'teacher-to-child'     // 선생님 → 아이
  | 'teacher-to-parent'    // 선생님 → 부모
  | 'child-to-parent';     // 아이 → 부모

// 상담 가이드
export interface ConsultationGuide {
  mode: ConsultationMode;
  title: string;
  description: string;
  tips: string[];
  exampleQuestions: string[];
}

// 최종 결과
export interface AssessmentResult {
  id: string;
  timestamp: string;
  basicInfo: BasicInfo;
  scores: CategoryScores;
  topCategories: CareerCategory[];
  jobs: JobRecommendation[];
  majors: MajorRecommendation[];
  ibProfiles: IBProfile[];
  aiInsights?: string;
  developmentTips?: string;
}

// 결과 비교
export interface ResultComparison {
  current: AssessmentResult;
  previous: AssessmentResult;
  scoreDifferences: Record<string, number>;
}
