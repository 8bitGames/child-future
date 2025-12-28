/**
 * 부모/교사 가이드 관련 타입 정의
 */

import { CareerCategory, IBLearnerProfile } from './assessment';
import { ParentingStyle, EducationGoal } from './parent';
import { AgeGroup } from './ib-enhanced';

/**
 * 가이드 유형
 */
export type GuideType =
  | 'daily'           // 일상 가이드
  | 'communication'   // 대화법 가이드
  | 'activity'        // 활동 가이드
  | 'learning'        // 학습 가이드
  | 'emotional'       // 정서 지원 가이드
  | 'development';    // 발달 가이드

export const GUIDE_TYPE_NAMES: Record<GuideType, string> = {
  daily: '일상 가이드',
  communication: '대화법 가이드',
  activity: '활동 가이드',
  learning: '학습 가이드',
  emotional: '정서 지원 가이드',
  development: '발달 가이드'
};

/**
 * 대화 시나리오
 */
export interface ConversationScenario {
  id: string;
  situation: string;  // 상황 설명
  childBehavior: string;  // 아이의 행동
  wrongResponse: {
    example: string;
    reason: string;
  };
  recommendedResponse: {
    example: string;
    reason: string;
    followUp: string[];
  };
  relatedProfiles: IBLearnerProfile[];
}

/**
 * 대화 가이드
 */
export interface ConversationGuide {
  id: string;
  title: string;
  targetProfile: IBLearnerProfile;
  ageGroup: AgeGroup;

  // 핵심 대화 원칙
  principles: string[];

  // 추천 표현
  recommendedPhrases: {
    situation: string;
    phrases: string[];
  }[];

  // 피해야 할 표현
  avoidPhrases: {
    phrase: string;
    reason: string;
    alternative: string;
  }[];

  // 대화 시나리오
  scenarios: ConversationScenario[];
}

/**
 * 양육 팁
 */
export interface ParentingTip {
  id: string;
  title: string;
  content: string;
  category: GuideType;
  targetProfiles: IBLearnerProfile[];
  targetStyles?: ParentingStyle[];
  ageGroups: AgeGroup[];
  actionItems: string[];
  doList: string[];
  dontList: string[];
}

/**
 * 학습 지원 가이드
 */
export interface LearningGuide {
  id: string;
  title: string;
  targetProfile: IBLearnerProfile;
  targetCategory: CareerCategory;

  // 학습 스타일 특성
  learningCharacteristics: string[];

  // 효과적인 학습 방법
  effectiveMethods: {
    method: string;
    description: string;
    examples: string[];
  }[];

  // 학습 환경 조성
  environmentTips: string[];

  // 동기부여 전략
  motivationStrategies: string[];

  // 어려움 극복 방법
  challengeSolutions: {
    challenge: string;
    solution: string;
  }[];
}

/**
 * 종합 부모 가이드
 */
export interface ParentGuide {
  // 메타 정보
  generatedAt: string;
  childNickname: string;
  childAge: number;
  ageGroup: AgeGroup;

  // 핵심 인사이트
  keyInsights: {
    title: string;
    description: string;
    actionItem: string;
  }[];

  // 아이 특성 요약
  childSummary: {
    topProfiles: IBLearnerProfile[];
    topCategories: CareerCategory[];
    strengths: string[];
    growthAreas: string[];
  };

  // 양육 가이드 (양육 스타일 기반)
  parentingAdvice?: {
    style: ParentingStyle;
    strengths: string[];
    watchPoints: string[];
    recommendations: string[];
  };

  // 대화 가이드
  communicationGuide: {
    principles: string[];
    dailyTopics: string[];
    encouragingPhrases: string[];
    avoidPhrases: string[];
  };

  // 활동 추천
  activityRecommendations: {
    daily: string[];
    weekly: string[];
    monthly: string[];
  };

  // 교육 목표 연계
  educationGoalAlignment?: {
    goal: EducationGoal;
    currentAlignment: number;  // 0-100
    suggestions: string[];
  }[];

  // IB 프로필별 가이드
  profileGuides: {
    profile: IBLearnerProfile;
    score: number;
    description: string;
    parentTips: string[];
    activities: string[];
  }[];

  // 다음 단계 추천
  nextSteps: {
    shortTerm: string[];  // 1-2주
    midTerm: string[];    // 1개월
    longTerm: string[];   // 3개월+
  };
}

/**
 * 교사 가이드
 */
export interface TeacherGuide {
  generatedAt: string;
  studentNickname: string;
  studentAge: number;
  ageGroup: AgeGroup;

  // 학생 특성 요약
  studentSummary: {
    topProfiles: IBLearnerProfile[];
    learningStyle: string;
    strengths: string[];
    supportAreas: string[];
  };

  // 교실 전략
  classroomStrategies: {
    engagement: string[];
    instruction: string[];
    assessment: string[];
    groupWork: string[];
  };

  // 개별화 지원
  individualization: {
    area: string;
    strategy: string;
    resources: string[];
  }[];

  // 부모 소통 포인트
  parentCommunication: {
    positivePoints: string[];
    growthAreas: string[];
    suggestions: string[];
  };
}

/**
 * 가이드 생성 요청
 */
export interface GuideGenerationRequest {
  childAge: number;
  childNickname: string;
  topProfiles: IBLearnerProfile[];
  topCategories: CareerCategory[];
  parentProfile?: {
    parentingStyle?: ParentingStyle;
    educationGoals?: EducationGoal[];
  };
  guideType: 'parent' | 'teacher' | 'both';
  focusAreas?: GuideType[];
}

/**
 * 가이드 템플릿
 */
export interface GuideTemplate {
  id: string;
  name: string;
  type: GuideType;
  targetProfiles: IBLearnerProfile[];
  ageGroups: AgeGroup[];
  sections: {
    title: string;
    content: string;
    variables: string[];  // 동적 치환 변수
  }[];
}
