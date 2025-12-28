/**
 * 연령별 상황 질문 데이터
 * 아이가 직접 응답하는 상황 기반 질문
 */

import { SituationQuestion } from '@/lib/types/ib-enhanced';

/**
 * 5-7세 (Early) 상황 질문
 * 특징: 시각적 지원, 간단한 선택지, 짧은 시나리오
 */
export const SITUATION_QUESTIONS_EARLY: SituationQuestion[] = [
  {
    id: 'SIT-EARLY-01',
    ageGroup: 'early',
    scenario: '새 장난감을 받았어요. 뭘 제일 먼저 하고 싶어요?',
    visualSupport: '/images/situations/new-toy.png',
    options: [
      {
        text: '어떻게 움직이는지 살펴보고 싶어요',
        ibWeights: { Inquirer: 2, Thinker: 1 },
        explanation: '궁금해하고 탐구하는 모습을 보여요'
      },
      {
        text: '친구들이랑 같이 가지고 놀고 싶어요',
        ibWeights: { Communicator: 2, Caring: 1 },
        explanation: '함께 나누고 소통하는 것을 좋아해요'
      },
      {
        text: '내 마음대로 가지고 놀고 싶어요',
        ibWeights: { 'Risk-taker': 1, 'Open-minded': 1 },
        explanation: '자유롭게 탐험하는 것을 좋아해요'
      },
      {
        text: '설명서에 나온 대로 해보고 싶어요',
        ibWeights: { Knowledgeable: 1, Principled: 1 },
        explanation: '정해진 방법을 따르는 것을 편해해요'
      }
    ],
    category: ['creative', 'analytical']
  },
  {
    id: 'SIT-EARLY-02',
    ageGroup: 'early',
    scenario: '친구가 놀이터에서 울고 있어요. 어떻게 할래요?',
    visualSupport: '/images/situations/crying-friend.png',
    options: [
      {
        text: '다가가서 왜 우는지 물어볼래요',
        ibWeights: { Caring: 2, Communicator: 1 },
        explanation: '친구의 마음을 이해하려고 해요'
      },
      {
        text: '선생님이나 어른을 불러올래요',
        ibWeights: { Principled: 2, Balanced: 1 },
        explanation: '도움을 줄 수 있는 사람을 찾아요'
      },
      {
        text: '같이 놀자고 할래요',
        ibWeights: { 'Open-minded': 1, 'Risk-taker': 1 },
        explanation: '직접 해결하려고 노력해요'
      },
      {
        text: '조용히 옆에 있어줄래요',
        ibWeights: { Caring: 1, Reflective: 1 },
        explanation: '편하게 해주려고 해요'
      }
    ],
    category: ['caring']
  },
  {
    id: 'SIT-EARLY-03',
    ageGroup: 'early',
    scenario: '블록으로 무언가를 만들고 있는데, 자꾸 무너져요. 어떻게 할래요?',
    visualSupport: '/images/situations/blocks-falling.png',
    options: [
      {
        text: '왜 무너지는지 생각해보고 다시 해볼래요',
        ibWeights: { Thinker: 2, 'Risk-taker': 1 },
        explanation: '문제를 분석하고 다시 도전해요'
      },
      {
        text: '다른 방법으로 만들어볼래요',
        ibWeights: { 'Open-minded': 2, Inquirer: 1 },
        explanation: '새로운 방법을 시도해요'
      },
      {
        text: '도와달라고 할래요',
        ibWeights: { Communicator: 1, Balanced: 1 },
        explanation: '도움을 요청할 줄 알아요'
      },
      {
        text: '다른 놀이를 할래요',
        ibWeights: { Balanced: 1 },
        explanation: '상황에 맞게 적응해요'
      }
    ],
    category: ['analytical', 'practical']
  }
];

/**
 * 8-10세 (Middle) 상황 질문
 * 특징: 학교/사회 상황, 선택의 이유 요구, 다양한 관점
 */
export const SITUATION_QUESTIONS_MIDDLE: SituationQuestion[] = [
  {
    id: 'SIT-MIDDLE-01',
    ageGroup: 'middle',
    scenario: '학교에서 자유 주제로 발표를 하게 됐어요. 어떤 주제로 하고 싶어요?',
    options: [
      {
        text: '내가 직접 실험해본 과학 주제',
        ibWeights: { Inquirer: 2, 'Risk-taker': 1 },
        explanation: '직접 탐구하고 발견하는 것을 좋아해요'
      },
      {
        text: '친구들을 도울 수 있는 방법',
        ibWeights: { Caring: 2, Principled: 1 },
        explanation: '다른 사람을 돕는 것에 관심이 있어요'
      },
      {
        text: '내가 그린 그림이나 만든 작품 소개',
        ibWeights: { 'Open-minded': 2, Communicator: 1 },
        explanation: '창의적으로 표현하는 것을 좋아해요'
      },
      {
        text: '우리 반을 더 좋게 만드는 아이디어',
        ibWeights: { Thinker: 2, Principled: 1 },
        explanation: '문제를 해결하고 개선하고 싶어해요'
      }
    ],
    category: ['creative', 'analytical', 'caring', 'leadership']
  },
  {
    id: 'SIT-MIDDLE-02',
    ageGroup: 'middle',
    scenario: '친구와 의견이 달라서 다투게 됐어요. 어떻게 할래요?',
    options: [
      {
        text: '친구의 생각도 들어보고 내 생각도 설명해요',
        ibWeights: { Communicator: 2, 'Open-minded': 1 },
        explanation: '대화로 해결하려고 해요'
      },
      {
        text: '내가 틀렸을 수도 있는지 생각해봐요',
        ibWeights: { Reflective: 2, 'Open-minded': 1 },
        explanation: '자기 자신을 돌아볼 줄 알아요'
      },
      {
        text: '서로 양보해서 중간 방법을 찾아요',
        ibWeights: { Balanced: 2, Caring: 1 },
        explanation: '조화를 중요하게 생각해요'
      },
      {
        text: '시간을 두고 나중에 다시 이야기해요',
        ibWeights: { Thinker: 1, Balanced: 1 },
        explanation: '감정을 조절하고 신중하게 해요'
      }
    ],
    category: ['caring', 'leadership']
  },
  {
    id: 'SIT-MIDDLE-03',
    ageGroup: 'middle',
    scenario: '새로 전학 온 친구가 혼자 있어요. 어떻게 할래요?',
    options: [
      {
        text: '다가가서 같이 놀자고 할래요',
        ibWeights: { Caring: 2, 'Risk-taker': 1 },
        explanation: '먼저 다가가는 용기가 있어요'
      },
      {
        text: '우리 반에 대해 알려줄래요',
        ibWeights: { Knowledgeable: 1, Communicator: 2 },
        explanation: '도움이 되는 정보를 나눠요'
      },
      {
        text: '친구들에게 소개해줄래요',
        ibWeights: { Communicator: 2, Caring: 1 },
        explanation: '관계를 연결해주는 역할을 해요'
      },
      {
        text: '먼저 인사하고 필요한 게 있으면 도와준다고 할래요',
        ibWeights: { Principled: 1, Caring: 2 },
        explanation: '예의 바르게 도움을 제안해요'
      }
    ],
    category: ['caring', 'leadership']
  },
  {
    id: 'SIT-MIDDLE-04',
    ageGroup: 'middle',
    scenario: '어려운 숙제가 있는데 잘 모르겠어요. 어떻게 할래요?',
    options: [
      {
        text: '더 찾아보고 연구해볼래요',
        ibWeights: { Inquirer: 2, 'Risk-taker': 1 },
        explanation: '스스로 해결하려고 노력해요'
      },
      {
        text: '선생님이나 부모님께 여쭤볼래요',
        ibWeights: { Communicator: 1, Balanced: 1 },
        explanation: '도움을 요청할 줄 알아요'
      },
      {
        text: '친구와 함께 해결해볼래요',
        ibWeights: { Communicator: 2, Caring: 1 },
        explanation: '협력하는 것을 좋아해요'
      },
      {
        text: '먼저 내가 아는 것부터 해보고 모르는 것을 정리해요',
        ibWeights: { Thinker: 2, Reflective: 1 },
        explanation: '체계적으로 접근해요'
      }
    ],
    category: ['analytical', 'practical']
  }
];

/**
 * 11-14세 (Late) 상황 질문
 * 특징: 복잡한 사회 상황, 가치 판단, 미래 지향적 질문
 */
export const SITUATION_QUESTIONS_LATE: SituationQuestion[] = [
  {
    id: 'SIT-LATE-01',
    ageGroup: 'late',
    scenario: '동아리를 만들 수 있다면 어떤 동아리를 만들고 싶어요?',
    options: [
      {
        text: '과학 탐구 또는 발명 동아리',
        ibWeights: { Inquirer: 2, Thinker: 2 },
        explanation: '탐구와 창의적 문제해결에 관심이 있어요'
      },
      {
        text: '봉사 활동 또는 환경 보호 동아리',
        ibWeights: { Caring: 2, Principled: 2 },
        explanation: '사회에 기여하고 싶어해요'
      },
      {
        text: '예술, 음악, 창작 동아리',
        ibWeights: { 'Open-minded': 2, Communicator: 1 },
        explanation: '창의적 표현을 좋아해요'
      },
      {
        text: '토론 또는 학생회 관련 동아리',
        ibWeights: { Communicator: 2, Thinker: 1 },
        explanation: '의견을 나누고 리드하는 것을 좋아해요'
      }
    ],
    category: ['creative', 'analytical', 'caring', 'leadership']
  },
  {
    id: 'SIT-LATE-02',
    ageGroup: 'late',
    scenario: '친구가 시험에서 부정행위를 하려고 해요. 어떻게 할래요?',
    options: [
      {
        text: '친구에게 하지 말라고 직접 말해요',
        ibWeights: { Principled: 2, 'Risk-taker': 1, Caring: 1 },
        explanation: '옳은 것을 위해 용기를 내요'
      },
      {
        text: '왜 그러려고 하는지 이유를 물어봐요',
        ibWeights: { Caring: 2, Reflective: 1 },
        explanation: '친구의 상황을 이해하려고 해요'
      },
      {
        text: '공부를 같이 도와줄게라고 제안해요',
        ibWeights: { Caring: 2, Communicator: 1 },
        explanation: '근본적인 해결책을 제시해요'
      },
      {
        text: '결과가 어떻게 될지 생각해보라고 해요',
        ibWeights: { Thinker: 2, Reflective: 1 },
        explanation: '스스로 생각하게 도와요'
      }
    ],
    category: ['caring', 'leadership']
  },
  {
    id: 'SIT-LATE-03',
    ageGroup: 'late',
    scenario: '그룹 프로젝트에서 한 친구가 맡은 일을 안 해와요. 어떻게 할래요?',
    options: [
      {
        text: '왜 못했는지 물어보고 함께 해결 방법을 찾아요',
        ibWeights: { Caring: 2, Communicator: 2 },
        explanation: '문제를 함께 해결하려고 해요'
      },
      {
        text: '모두 모여서 역할을 다시 나눠요',
        ibWeights: { Thinker: 2, Balanced: 1 },
        explanation: '공정하게 재조정하려고 해요'
      },
      {
        text: '내가 일부 대신 해줄게라고 해요',
        ibWeights: { Caring: 1, 'Risk-taker': 1 },
        explanation: '프로젝트 완성을 위해 양보해요'
      },
      {
        text: '선생님께 상황을 말씀드려요',
        ibWeights: { Principled: 2, Balanced: 1 },
        explanation: '공정한 해결을 원해요'
      }
    ],
    category: ['leadership', 'caring']
  },
  {
    id: 'SIT-LATE-04',
    ageGroup: 'late',
    scenario: '관심 있는 분야가 여러 개인데, 진로를 어떻게 정하면 좋을까요?',
    options: [
      {
        text: '하나씩 더 깊이 알아보고 싶어요',
        ibWeights: { Inquirer: 2, Knowledgeable: 1 },
        explanation: '탐구를 통해 결정하려고 해요'
      },
      {
        text: '여러 분야를 연결할 수 있는 길을 찾아볼래요',
        ibWeights: { Thinker: 2, 'Open-minded': 1 },
        explanation: '창의적으로 결합하려고 해요'
      },
      {
        text: '사람들에게 도움이 되는 방향으로 정하고 싶어요',
        ibWeights: { Caring: 2, Principled: 1 },
        explanation: '가치를 중심으로 결정해요'
      },
      {
        text: '가장 도전적이고 흥미로운 것을 해보고 싶어요',
        ibWeights: { 'Risk-taker': 2, Inquirer: 1 },
        explanation: '도전을 통해 성장하고 싶어해요'
      }
    ],
    category: ['analytical', 'creative', 'caring', 'leadership', 'practical']
  }
];

/**
 * 전체 상황 질문 데이터
 */
export const ALL_SITUATION_QUESTIONS: SituationQuestion[] = [
  ...SITUATION_QUESTIONS_EARLY,
  ...SITUATION_QUESTIONS_MIDDLE,
  ...SITUATION_QUESTIONS_LATE
];

/**
 * 연령에 맞는 상황 질문 가져오기
 */
export function getSituationQuestionsByAge(age: number): SituationQuestion[] {
  if (age >= 5 && age <= 7) return SITUATION_QUESTIONS_EARLY;
  if (age >= 8 && age <= 10) return SITUATION_QUESTIONS_MIDDLE;
  if (age >= 11 && age <= 14) return SITUATION_QUESTIONS_LATE;
  return SITUATION_QUESTIONS_MIDDLE; // 기본값
}

/**
 * 특정 직업군 관련 상황 질문 필터링
 */
export function getSituationQuestionsByCategory(category: string): SituationQuestion[] {
  return ALL_SITUATION_QUESTIONS.filter(
    q => q.category?.includes(category as any)
  );
}

/**
 * 랜덤 상황 질문 선택 (지정 개수)
 */
export function getRandomSituationQuestions(age: number, count: number = 4): SituationQuestion[] {
  const questions = getSituationQuestionsByAge(age);
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
