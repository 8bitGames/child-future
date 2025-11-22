import { Question } from '@/lib/types/assessment';

// 빠른 검사용 질문 ID (각 직업군당 2개씩, 총 10개)
export const QUICK_QUESTION_IDS = [
  'q1', 'q2',   // 창의·예술형
  'q6', 'q7',   // 분석·연구형
  'q11', 'q12', // 사람·돌봄형
  'q16', 'q17', // 리더·조직형
  'q21', 'q22', // 실무·기술형
];

// 성향 검사 문항 (24개)
// 각 직업군당 4-5개 문항씩 배치
export const ASSESSMENT_QUESTIONS: Question[] = [
  // 창의·예술형 (Creative) - 5문항
  {
    id: 'q1',
    text: '새로운 아이디어나 창작 활동을 할 때 시간 가는 줄 모른다',
    category: ['creative'],
    weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q2',
    text: '그림 그리기, 만들기, 디자인 같은 활동을 좋아한다',
    category: ['creative'],
    weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q3',
    text: '이야기를 만들거나 상상하는 것을 즐긴다',
    category: ['creative'],
    weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q4',
    text: '색깔, 모양, 디자인에 관심이 많다',
    category: ['creative'],
    weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q5',
    text: '음악, 춤, 연극 같은 예술 활동에 흥미가 있다',
    category: ['creative'],
    weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 0 }
  },

  // 분석·연구형 (Analytical) - 5문항
  {
    id: 'q6',
    text: '복잡한 문제를 분석하고 해결하는 것이 재미있다',
    category: ['analytical'],
    weights: { creative: 0, analytical: 2, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q7',
    text: '퍼즐이나 수학 문제 푸는 것을 좋아한다',
    category: ['analytical'],
    weights: { creative: 0, analytical: 2, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q8',
    text: '왜 그런지 원리를 알고 싶어서 질문을 많이 한다',
    category: ['analytical'],
    weights: { creative: 0, analytical: 2, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q9',
    text: '실험이나 탐구 활동에 관심이 많다',
    category: ['analytical'],
    weights: { creative: 0, analytical: 2, caring: 0, leadership: 0, practical: 0 }
  },
  {
    id: 'q10',
    text: '데이터나 정보를 정리하고 분석하는 것을 좋아한다',
    category: ['analytical'],
    weights: { creative: 0, analytical: 2, caring: 0, leadership: 0, practical: 0 }
  },

  // 사람·돌봄형 (Caring) - 5문항
  {
    id: 'q11',
    text: '친구가 힘들어하면 도와주고 싶은 마음이 든다',
    category: ['caring'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 0 }
  },
  {
    id: 'q12',
    text: '다른 사람의 감정을 잘 이해하는 편이다',
    category: ['caring'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 0 }
  },
  {
    id: 'q13',
    text: '동물이나 식물을 돌보는 것을 좋아한다',
    category: ['caring'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 0 }
  },
  {
    id: 'q14',
    text: '친구들의 고민을 들어주고 조언하는 것을 즐긴다',
    category: ['caring'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 0 }
  },
  {
    id: 'q15',
    text: '봉사 활동이나 남을 돕는 일에 관심이 있다',
    category: ['caring'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 0 }
  },

  // 리더·조직형 (Leadership) - 5문항
  {
    id: 'q16',
    text: '모둠 활동에서 계획을 세우고 역할을 나누는 것을 좋아한다',
    category: ['leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 2, practical: 0 }
  },
  {
    id: 'q17',
    text: '친구들 앞에서 발표하거나 이야기하는 것이 즐겁다',
    category: ['leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 2, practical: 0 }
  },
  {
    id: 'q18',
    text: '새로운 프로젝트나 행사를 기획하는 것에 관심이 있다',
    category: ['leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 2, practical: 0 }
  },
  {
    id: 'q19',
    text: '친구들과 의견이 다를 때 조정하는 역할을 잘한다',
    category: ['leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 2, practical: 0 }
  },
  {
    id: 'q20',
    text: '목표를 정하고 그것을 이루기 위해 노력하는 것을 좋아한다',
    category: ['leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 2, practical: 0 }
  },

  // 실무·기술형 (Practical) - 4문항
  {
    id: 'q21',
    text: '손으로 직접 만들거나 조립하는 활동을 좋아한다',
    category: ['practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 2 }
  },
  {
    id: 'q22',
    text: '운동이나 신체 활동을 즐긴다',
    category: ['practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 2 }
  },
  {
    id: 'q23',
    text: '기계나 도구를 사용하는 것에 관심이 많다',
    category: ['practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 2 }
  },
  {
    id: 'q24',
    text: '실제로 해보면서 배우는 것을 선호한다',
    category: ['practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 2 }
  },
];

// 응답 척도 레이블
export const SCALE_LABELS = [
  '전혀 그렇지 않다',
  '그렇지 않은 편이다',
  '보통이다',
  '그런 편이다',
  '매우 그렇다'
];
