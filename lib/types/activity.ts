/**
 * 활동 추천 관련 타입 정의
 */

import { CareerCategory, IBLearnerProfile } from './assessment';
import { AgeGroup } from './ib-enhanced';

/**
 * 활동 카테고리
 */
export type ActivityCategory =
  | 'creative'        // 창작/예술
  | 'physical'        // 체육/운동
  | 'intellectual'    // 지적/학습
  | 'social'          // 사회/봉사
  | 'nature'          // 자연/탐험
  | 'tech'            // 기술/디지털
  | 'cultural';       // 문화/예술

export const ACTIVITY_CATEGORY_NAMES: Record<ActivityCategory, string> = {
  creative: '창작/예술',
  physical: '체육/운동',
  intellectual: '지적/학습',
  social: '사회/봉사',
  nature: '자연/탐험',
  tech: '기술/디지털',
  cultural: '문화/예술'
};

/**
 * 활동 난이도
 */
export type ActivityDifficulty = 'easy' | 'medium' | 'challenging';

export const ACTIVITY_DIFFICULTY_NAMES: Record<ActivityDifficulty, string> = {
  easy: '쉬움',
  medium: '보통',
  challenging: '도전적'
};

/**
 * 활동 환경
 */
export type ActivityEnvironment = 'indoor' | 'outdoor' | 'both';

/**
 * 활동 참여 형태
 */
export type ParticipationType = 'individual' | 'pair' | 'group' | 'family';

export const PARTICIPATION_TYPE_NAMES: Record<ParticipationType, string> = {
  individual: '개인',
  pair: '짝',
  group: '그룹',
  family: '가족'
};

/**
 * 활동 시간
 */
export type ActivityDuration = 'short' | 'medium' | 'long';

export const ACTIVITY_DURATION_INFO: Record<ActivityDuration, { label: string; minutes: string }> = {
  short: { label: '짧음', minutes: '15-30분' },
  medium: { label: '보통', minutes: '30분-1시간' },
  long: { label: '김', minutes: '1시간 이상' }
};

/**
 * 필요 자원
 */
export interface ActivityResource {
  type: 'material' | 'space' | 'equipment' | 'digital';
  name: string;
  required: boolean;  // 필수 여부
  alternatives?: string[];  // 대체품
}

/**
 * 활동 정의
 */
export interface Activity {
  id: string;
  name: string;
  description: string;
  shortDescription: string;  // 한 줄 설명

  // 분류
  category: ActivityCategory;
  difficulty: ActivityDifficulty;
  environment: ActivityEnvironment;
  participation: ParticipationType[];
  duration: ActivityDuration;

  // 대상
  ageGroups: AgeGroup[];
  minAge: number;
  maxAge: number;

  // 연결
  targetProfiles: IBLearnerProfile[];  // 관련 IB 프로필
  targetCategories: CareerCategory[];  // 관련 직업군
  developedSkills: string[];  // 개발되는 역량

  // 상세
  instructions: string[];  // 진행 방법
  tips: string[];  // 부모/교사 팁
  variations: string[];  // 변형 활동
  resources: ActivityResource[];

  // 메타
  imageUrl?: string;
  videoUrl?: string;
  source?: string;
}

/**
 * 활동 추천 결과
 */
export interface ActivityRecommendation {
  activity: Activity;
  matchScore: number;  // 0-100 매칭 점수
  matchReasons: string[];
  priorityLevel: 'high' | 'medium' | 'low';
}

/**
 * 활동 매칭 요청
 */
export interface ActivityMatchRequest {
  childAge: number;
  topProfiles: IBLearnerProfile[];
  topCategories: CareerCategory[];
  preferences?: {
    environment?: ActivityEnvironment;
    duration?: ActivityDuration;
    participation?: ParticipationType;
    difficulty?: ActivityDifficulty;
  };
  excludeActivityIds?: string[];  // 이미 추천받은 활동 제외
  limit?: number;
}

/**
 * 부모-아이 함께하는 활동
 */
export interface FamilyActivity extends Activity {
  parentRole: string;  // 부모 역할 설명
  interactionTips: string[];  // 상호작용 팁
  observationPoints: string[];  // 관찰 포인트
  discussionQuestions: string[];  // 대화 주제
}

/**
 * 활동 완료 기록
 */
export interface ActivityLog {
  activityId: string;
  completedAt: string;
  duration: number;  // 실제 소요 시간 (분)
  rating?: 1 | 2 | 3 | 4 | 5;  // 만족도
  notes?: string;
  observations?: string[];  // 관찰된 행동
}

/**
 * 활동 컬렉션 (테마별 활동 묶음)
 */
export interface ActivityCollection {
  id: string;
  name: string;
  description: string;
  theme: string;  // 예: "창의력 개발 주간", "과학 탐험 시리즈"
  activities: Activity[];
  suggestedOrder: string[];  // 추천 진행 순서 (activity id)
  totalDuration: string;  // 예: "5일", "2주"
}
