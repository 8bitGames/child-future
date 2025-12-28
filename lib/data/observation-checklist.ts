/**
 * 관찰 체크리스트 데이터
 * 부모/교사가 아이의 행동을 관찰하여 IB 프로필 판별에 활용
 */

import { ObservationItem } from '@/lib/types/ib-enhanced';

// Re-export for convenience
export type { ObservationItem };

/**
 * 관찰 체크리스트 항목
 * 빈도: never(전혀) | rarely(거의 안 함) | sometimes(가끔) | often(자주) | always(항상)
 */
export const OBSERVATION_CHECKLIST: ObservationItem[] = [
  // ===== Inquirer (탐구하는 사람) =====
  {
    id: 'OBS-INQ-01',
    profileTarget: ['Inquirer'],
    question: '새로운 것을 보면 "왜?", "어떻게?" 등의 질문을 자주 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-INQ-02',
    profileTarget: ['Inquirer'],
    question: '궁금한 것이 생기면 스스로 찾아보려고 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 7, max: 14 },
    weight: 1.2
  },
  {
    id: 'OBS-INQ-03',
    profileTarget: ['Inquirer', 'Knowledgeable'],
    question: '책, 영상, 인터넷 등 다양한 방법으로 정보를 찾습니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 8, max: 14 },
    weight: 1
  },

  // ===== Knowledgeable (지식이 있는 사람) =====
  {
    id: 'OBS-KNW-01',
    profileTarget: ['Knowledgeable'],
    question: '다양한 주제에 대해 알고 싶어합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-KNW-02',
    profileTarget: ['Knowledgeable', 'Inquirer'],
    question: '새로 배운 것을 다른 상황에 연결지어 생각합니다',
    frequency: 'sometimes',
    context: 'school',
    ageRange: { min: 8, max: 14 },
    weight: 1.2
  },

  // ===== Thinker (생각하는 사람) =====
  {
    id: 'OBS-THK-01',
    profileTarget: ['Thinker'],
    question: '문제가 생기면 여러 방법을 생각해보고 해결하려 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-THK-02',
    profileTarget: ['Thinker'],
    question: '선택할 때 장단점을 비교해봅니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 7, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-THK-03',
    profileTarget: ['Thinker', 'Inquirer'],
    question: '"만약 ~라면?" 하는 상상을 자주 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 0.8
  },

  // ===== Communicator (소통하는 사람) =====
  {
    id: 'OBS-COM-01',
    profileTarget: ['Communicator'],
    question: '자신의 생각이나 감정을 말이나 글로 잘 표현합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-COM-02',
    profileTarget: ['Communicator'],
    question: '다른 사람의 말을 끝까지 경청합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-COM-03',
    profileTarget: ['Communicator', 'Caring'],
    question: '그룹 활동에서 친구들과 협력을 잘 합니다',
    frequency: 'sometimes',
    context: 'school',
    ageRange: { min: 6, max: 14 },
    weight: 1
  },

  // ===== Principled (원칙을 지키는 사람) =====
  {
    id: 'OBS-PRI-01',
    profileTarget: ['Principled'],
    question: '규칙을 잘 지키고 그 이유도 이해합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-PRI-02',
    profileTarget: ['Principled'],
    question: '불공정한 상황을 보면 문제라고 느낍니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-PRI-03',
    profileTarget: ['Principled', 'Reflective'],
    question: '자신의 잘못을 인정하고 사과할 줄 압니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1.2
  },

  // ===== Open-minded (열린 마음을 가진 사람) =====
  {
    id: 'OBS-OPN-01',
    profileTarget: ['Open-minded'],
    question: '다른 나라나 문화에 대해 관심을 보입니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-OPN-02',
    profileTarget: ['Open-minded'],
    question: '친구의 다른 의견도 존중하며 들어봅니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-OPN-03',
    profileTarget: ['Open-minded', 'Risk-taker'],
    question: '새로운 음식이나 활동을 거부감 없이 시도합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 0.8
  },

  // ===== Caring (배려하는 사람) =====
  {
    id: 'OBS-CAR-01',
    profileTarget: ['Caring'],
    question: '친구나 가족이 힘들어하면 위로하거나 도와주려 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-CAR-02',
    profileTarget: ['Caring'],
    question: '다른 사람의 감정을 잘 알아차립니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 },
    weight: 1.2
  },
  {
    id: 'OBS-CAR-03',
    profileTarget: ['Caring', 'Principled'],
    question: '동식물을 잘 돌보고 아낍니다',
    frequency: 'sometimes',
    context: 'home',
    ageRange: { min: 5, max: 14 },
    weight: 0.8
  },

  // ===== Risk-taker (도전하는 사람) =====
  {
    id: 'OBS-RSK-01',
    profileTarget: ['Risk-taker'],
    question: '새로운 것을 시도하는 것을 두려워하지 않습니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-RSK-02',
    profileTarget: ['Risk-taker'],
    question: '어려운 과제에도 포기하지 않고 도전합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 },
    weight: 1.2
  },
  {
    id: 'OBS-RSK-03',
    profileTarget: ['Risk-taker', 'Reflective'],
    question: '실패해도 다시 시도하려 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 },
    weight: 1
  },

  // ===== Balanced (균형 잡힌 사람) =====
  {
    id: 'OBS-BAL-01',
    profileTarget: ['Balanced'],
    question: '공부, 놀이, 휴식의 균형을 잘 유지합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 7, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-BAL-02',
    profileTarget: ['Balanced'],
    question: '감정을 적절하게 조절합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-BAL-03',
    profileTarget: ['Balanced', 'Caring'],
    question: '건강한 생활 습관을 가지고 있습니다',
    frequency: 'sometimes',
    context: 'home',
    ageRange: { min: 5, max: 14 },
    weight: 0.8
  },

  // ===== Reflective (성찰하는 사람) =====
  {
    id: 'OBS-REF-01',
    profileTarget: ['Reflective'],
    question: '자신의 행동이나 결과에 대해 돌아봅니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 7, max: 14 },
    weight: 1
  },
  {
    id: 'OBS-REF-02',
    profileTarget: ['Reflective'],
    question: '실수를 통해 배우려고 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 },
    weight: 1.2
  },
  {
    id: 'OBS-REF-03',
    profileTarget: ['Reflective', 'Thinker'],
    question: '자신의 강점과 약점을 알고 있습니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 8, max: 14 },
    weight: 1
  }
];

/**
 * 연령대에 맞는 체크리스트 항목 필터링
 */
export function getChecklistByAge(age: number): ObservationItem[] {
  return OBSERVATION_CHECKLIST.filter(
    item => age >= item.ageRange.min && age <= item.ageRange.max
  );
}

/**
 * 특정 프로필 관련 체크리스트 항목 가져오기
 */
export function getChecklistByProfile(profileId: string): ObservationItem[] {
  return OBSERVATION_CHECKLIST.filter(
    item => item.profileTarget.includes(profileId as any)
  );
}

/**
 * 관찰 환경별 체크리스트 필터링
 */
export function getChecklistByContext(context: 'home' | 'school' | 'both'): ObservationItem[] {
  return OBSERVATION_CHECKLIST.filter(
    item => item.context === context || item.context === 'both'
  );
}

/**
 * 간소화 모드용 핵심 체크리스트 (10개)
 */
export const QUICK_CHECKLIST_IDS = [
  'OBS-INQ-01',  // 탐구
  'OBS-THK-01',  // 사고
  'OBS-COM-01',  // 소통
  'OBS-CAR-01',  // 배려
  'OBS-RSK-01',  // 도전
  'OBS-PRI-01',  // 원칙
  'OBS-OPN-01',  // 열린마음
  'OBS-BAL-01',  // 균형
  'OBS-REF-01',  // 성찰
  'OBS-KNW-01',  // 지식
];

export function getQuickChecklist(): ObservationItem[] {
  return OBSERVATION_CHECKLIST.filter(item => QUICK_CHECKLIST_IDS.includes(item.id));
}

/**
 * 빈도 점수 변환
 */
export const FREQUENCY_SCORES: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  always: 4
};

export const FREQUENCY_LABELS_KO: Record<string, string> = {
  never: '전혀 아님',
  rarely: '거의 아님',
  sometimes: '가끔',
  often: '자주',
  always: '항상'
};
