// 검사 모드 타입
export type AssessmentMode = 'quick' | 'full' | 'extend';

// 5개 직업군 타입
export type CareerCategory = 'creative' | 'analytical' | 'caring' | 'leadership' | 'practical';

// 직업군 한글 이름 매핑
export const CAREER_CATEGORY_NAMES: Record<CareerCategory, string> = {
  creative: '창의·예술형',
  analytical: '분석·연구형',
  caring: '사람·돌봄형',
  leadership: '리더·조직형',
  practical: '실무·기술형'
};

// 성향 검사 문항
export interface Question {
  id: string;
  text: string;
  category: CareerCategory[];
  weights: Record<CareerCategory, number>;
}

// 사용자 응답 (1-5 척도)
export interface QuestionResponse {
  questionId: string;
  value: 1 | 2 | 3 | 4 | 5;
}

// 기본 정보
export interface BasicInfo {
  nickname: string;
  age: number;
  grade?: string;
  gender?: 'male' | 'female' | 'prefer-not-to-say';
  activities: string[];      // 학원, 방과후, 운동
  hobbies: string[];         // 취미 활동
  interests: string[];       // 관심사
  strongSubjects: string[];  // 잘하는 과목
  achievements: string[];    // 상 받은 이력
  // 선택적 참고 정보
  likes?: string[];          // 좋아하는 것
  dreamJob?: string[];       // 되고 싶은 것
  dislikes?: string[];       // 싫어하는 것
}

// 상담 피드백
export interface ConsultationFeedback {
  schoolFeedback: string;   // 학교 상담에서 들은 말
  academyFeedback: string;  // 학원 상담에서 들은 말
}

// 완전한 검사 데이터
export interface AssessmentData {
  basicInfo: BasicInfo;
  consultation: ConsultationFeedback;
  responses: QuestionResponse[];
  timestamp: string;
}
