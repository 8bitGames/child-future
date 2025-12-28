import { Question } from '@/lib/types/assessment';

// 빠른 검사용 질문 ID (각 직업군당 2개씩, 총 10개)
export const QUICK_QUESTION_IDS = [
  'q1', 'q4',   // 창의·예술형
  'q5', 'q6',   // 분석·연구형
  'q9', 'q10',  // 사람·돌봄형
  'q13', 'q16', // 리더·조직형
  'q17', 'q18', // 실무·기술형
];

// 성향 검사 문항 (24개)
// IB 학습자상과 5개 직업군을 복합적으로 측정
// 질문 유형: 부모가 아이에게 읽어주는 질문 형식
export const ASSESSMENT_QUESTIONS: Question[] = [
  // ===== 창의·예술형 (Creative) - Q1~Q4 =====
  {
    id: 'q1',
    text: '새로운 방법을 생각해내는 게 재미있어? 같은 것도 다르게 해보려고 하는 편이야?',
    category: ['creative', 'analytical', 'leadership'],
    weights: { creative: 3, analytical: 1, caring: 0, leadership: 1, practical: 0 },
    ibWeights: { Thinker: 2, 'Risk-taker': 2, Inquirer: 1 }
  },
  {
    id: 'q2',
    text: '나만의 독특한 아이디어를 표현하는 게 중요하다고 생각해?',
    category: ['creative', 'leadership'],
    weights: { creative: 3, analytical: 0, caring: 0, leadership: 1, practical: 0 },
    ibWeights: { Thinker: 1, 'Risk-taker': 1, 'Open-minded': 2 }
  },
  {
    id: 'q3',
    text: '그림, 음악, 글쓰기 같은 걸로 생각이나 감정을 표현하는 경우가 많아?',
    category: ['creative', 'caring'],
    weights: { creative: 3, analytical: 0, caring: 1, leadership: 0, practical: 0 },
    ibWeights: { Communicator: 2, 'Open-minded': 1, Reflective: 1 }
  },
  {
    id: 'q4',
    text: '무언가를 만들 때, 실패해도 괜찮으니까 새로운 시도를 해보는 편이야?',
    category: ['creative', 'practical'],
    weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 2 },
    ibWeights: { 'Risk-taker': 3, Thinker: 1, Reflective: 1 }
  },

  // ===== 분석·연구형 (Analytical) - Q5~Q8 =====
  {
    id: 'q5',
    text: '궁금한 게 있으면 답을 찾을 때까지 여러 방법으로 알아보는 편이야?',
    category: ['analytical', 'creative'],
    weights: { creative: 1, analytical: 3, caring: 0, leadership: 0, practical: 0 },
    ibWeights: { Inquirer: 3, Thinker: 2, Knowledgeable: 1 }
  },
  {
    id: 'q6',
    text: '복잡한 문제를 차근차근 나눠서 생각하는 걸 잘해?',
    category: ['analytical', 'leadership'],
    weights: { creative: 0, analytical: 3, caring: 0, leadership: 1, practical: 0 },
    ibWeights: { Thinker: 3, Knowledgeable: 1, Reflective: 1 }
  },
  {
    id: 'q7',
    text: '왜 그런지 이유나 원리를 알고 싶어서 질문을 많이 하는 편이야?',
    category: ['analytical', 'creative'],
    weights: { creative: 1, analytical: 3, caring: 0, leadership: 0, practical: 0 },
    ibWeights: { Inquirer: 2, Thinker: 2, Communicator: 1 }
  },
  {
    id: 'q8',
    text: '정확한 정보를 바탕으로 판단하는 게 중요하다고 생각해?',
    category: ['analytical', 'leadership'],
    weights: { creative: 0, analytical: 3, caring: 0, leadership: 1, practical: 0 },
    ibWeights: { Knowledgeable: 2, Thinker: 2, Principled: 1 }
  },

  // ===== 사람·돌봄형 (Caring) - Q9~Q12 =====
  {
    id: 'q9',
    text: '다른 사람의 기분이나 감정을 잘 알아차리는 것 같아?',
    category: ['caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 3, leadership: 1, practical: 0 },
    ibWeights: { Caring: 3, Communicator: 2, 'Open-minded': 1 }
  },
  {
    id: 'q10',
    text: '친구가 힘들어할 때, 어떻게든 도와주고 싶은 마음이 먼저 들어?',
    category: ['caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 3, leadership: 1, practical: 0 },
    ibWeights: { Caring: 3, Principled: 1, Communicator: 1 }
  },
  {
    id: 'q11',
    text: '나와 다른 생각이나 의견도 존중하면서 들으려고 해?',
    category: ['caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 2, practical: 0 },
    ibWeights: { 'Open-minded': 3, Communicator: 2, Principled: 1 }
  },
  {
    id: 'q12',
    text: '공정하게 대우받는 것과 공정하게 대하는 게 중요하다고 생각해?',
    category: ['caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 2, practical: 0 },
    ibWeights: { Principled: 3, Caring: 1, 'Open-minded': 1 }
  },

  // ===== 리더·조직형 (Leadership) - Q13~Q16 =====
  {
    id: 'q13',
    text: '모둠 활동에서 계획을 세우거나 역할을 나누는 걸 자연스럽게 하는 편이야?',
    category: ['leadership', 'caring', 'analytical'],
    weights: { creative: 0, analytical: 1, caring: 1, leadership: 3, practical: 0 },
    ibWeights: { Communicator: 2, 'Risk-taker': 1, Thinker: 1 }
  },
  {
    id: 'q14',
    text: '내 생각을 다른 사람들 앞에서 명확하게 설명할 수 있어?',
    category: ['leadership', 'creative'],
    weights: { creative: 1, analytical: 0, caring: 0, leadership: 3, practical: 0 },
    ibWeights: { Communicator: 3, 'Risk-taker': 1, Knowledgeable: 1 }
  },
  {
    id: 'q15',
    text: '친구들 사이에 갈등이 있을 때, 중간에서 조정하려고 노력하는 편이야?',
    category: ['leadership', 'caring'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 2, practical: 0 },
    ibWeights: { Communicator: 2, Principled: 2, Caring: 1 }
  },
  {
    id: 'q16',
    text: '목표를 정하고 계획적으로 노력하는 게 중요하다고 생각해?',
    category: ['leadership', 'practical', 'analytical'],
    weights: { creative: 0, analytical: 1, caring: 0, leadership: 3, practical: 1 },
    ibWeights: { 'Risk-taker': 2, Reflective: 2, Principled: 1 }
  },

  // ===== 실무·기술형 (Practical) - Q17~Q20 =====
  {
    id: 'q17',
    text: '직접 손으로 만들거나 몸을 움직이는 활동을 할 때 더 집중이 잘 돼?',
    category: ['practical', 'creative'],
    weights: { creative: 1, analytical: 0, caring: 0, leadership: 0, practical: 3 },
    ibWeights: { Balanced: 2, 'Risk-taker': 1, Reflective: 1 }
  },
  {
    id: 'q18',
    text: '새로운 도구나 기계를 사용해보는 걸 두려워하지 않는 편이야?',
    category: ['practical', 'analytical'],
    weights: { creative: 0, analytical: 1, caring: 0, leadership: 0, practical: 3 },
    ibWeights: { 'Risk-taker': 3, Inquirer: 1, Thinker: 1 }
  },
  {
    id: 'q19',
    text: '설명만 듣는 것보다 직접 해보면서 배우는 게 더 좋아?',
    category: ['practical', 'creative'],
    weights: { creative: 1, analytical: 0, caring: 0, leadership: 0, practical: 3 },
    ibWeights: { Inquirer: 2, Balanced: 2, 'Risk-taker': 1 }
  },
  {
    id: 'q20',
    text: '규칙적인 생활과 건강한 습관을 유지하려고 노력하는 편이야?',
    category: ['practical', 'caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 1, leadership: 1, practical: 2 },
    ibWeights: { Balanced: 3, Reflective: 2, Principled: 1 }
  },

  // ===== 복합 질문 (Q21~Q24) - 여러 특성 균형 측정 =====
  {
    id: 'q21',
    text: '실수를 했을 때, 왜 그랬는지 돌아보고 다음에는 다르게 해보려고 해?',
    category: ['analytical', 'caring', 'leadership'],
    weights: { creative: 0, analytical: 2, caring: 1, leadership: 1, practical: 0 },
    ibWeights: { Reflective: 3, Thinker: 2, 'Risk-taker': 1 }
  },
  {
    id: 'q22',
    text: '나만 잘 되는 것보다 함께 잘 되는 게 더 기분 좋아?',
    category: ['caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 2, leadership: 2, practical: 0 },
    ibWeights: { Caring: 2, Principled: 2, 'Open-minded': 1 }
  },
  {
    id: 'q23',
    text: '새로 알게 된 걸 다른 사람에게 설명하거나 공유하는 걸 좋아해?',
    category: ['leadership', 'analytical', 'caring'],
    weights: { creative: 0, analytical: 1, caring: 1, leadership: 2, practical: 0 },
    ibWeights: { Communicator: 2, Knowledgeable: 2, Inquirer: 1 }
  },
  {
    id: 'q24',
    text: '어려운 상황에서도 포기하지 않고 끝까지 해보려는 편이야?',
    category: ['practical', 'leadership', 'analytical'],
    weights: { creative: 0, analytical: 1, caring: 0, leadership: 2, practical: 1 },
    ibWeights: { 'Risk-taker': 2, Balanced: 1, Reflective: 1, Principled: 1 }
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

// ===== 정밀 검사용 상황 판단형 질문 (10개) =====
export const SITUATION_QUESTIONS: Question[] = [
  // S1: 학교 축제 상황
  {
    id: 's1',
    text: '학교 축제를 준비한대. 어떤 역할을 가장 하고 싶어?',
    type: 'situation',
    category: ['creative', 'analytical', 'caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '부스 디자인과 꾸미기',
        weights: { creative: 3, analytical: 0, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { 'Open-minded': 2, 'Risk-taker': 1 }
      },
      {
        label: 'B',
        text: '예산 계획과 물품 관리',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 1, practical: 0 },
        ibWeights: { Thinker: 2, Knowledgeable: 1 }
      },
      {
        label: 'C',
        text: '방문객 안내와 설명',
        weights: { creative: 0, analytical: 0, caring: 3, leadership: 1, practical: 0 },
        ibWeights: { Communicator: 2, Caring: 1 }
      },
      {
        label: 'D',
        text: '전체 일정과 역할 조율',
        weights: { creative: 0, analytical: 1, caring: 0, leadership: 3, practical: 0 },
        ibWeights: { Communicator: 1, 'Risk-taker': 2 }
      }
    ]
  },
  // S2: 과학 실험 실패 상황
  {
    id: 's2',
    text: '과학 시간에 실험이 실패했어. 처음에 어떻게 할 것 같아?',
    type: 'situation',
    category: ['analytical', 'creative', 'caring', 'leadership'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '왜 실패했는지 원인을 분석한다',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { Inquirer: 2, Thinker: 2 }
      },
      {
        label: 'B',
        text: '새로운 방법으로 다시 시도한다',
        weights: { creative: 2, analytical: 0, caring: 0, leadership: 0, practical: 2 },
        ibWeights: { 'Risk-taker': 3, Reflective: 1 }
      },
      {
        label: 'C',
        text: '선생님이나 친구에게 조언을 구한다',
        weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 1 },
        ibWeights: { Communicator: 2, 'Open-minded': 1 }
      },
      {
        label: 'D',
        text: '팀원들과 역할을 다시 나눈다',
        weights: { creative: 0, analytical: 0, caring: 1, leadership: 3, practical: 0 },
        ibWeights: { Communicator: 1, Principled: 1 }
      }
    ]
  },
  // S3: 친구 갈등 상황
  {
    id: 's3',
    text: '친한 친구 두 명이 서로 싸웠어. 어떻게 할 것 같아?',
    type: 'situation',
    category: ['caring', 'leadership', 'analytical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '양쪽 이야기를 다 들어본다',
        weights: { creative: 0, analytical: 2, caring: 2, leadership: 0, practical: 0 },
        ibWeights: { 'Open-minded': 3, Caring: 1 }
      },
      {
        label: 'B',
        text: '중간에서 화해를 시도한다',
        weights: { creative: 0, analytical: 0, caring: 2, leadership: 2, practical: 0 },
        ibWeights: { Communicator: 2, Principled: 1 }
      },
      {
        label: 'C',
        text: '시간을 두고 지켜본다',
        weights: { creative: 0, analytical: 1, caring: 1, leadership: 0, practical: 2 },
        ibWeights: { Reflective: 2, Balanced: 1 }
      },
      {
        label: 'D',
        text: '선생님이나 어른에게 알린다',
        weights: { creative: 0, analytical: 0, caring: 2, leadership: 1, practical: 1 },
        ibWeights: { Principled: 2, Caring: 1 }
      }
    ]
  },
  // S4: 모둠 발표 상황
  {
    id: 's4',
    text: '모둠 발표를 준비한대. 어떤 부분을 맡고 싶어?',
    type: 'situation',
    category: ['creative', 'analytical', 'leadership', 'practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: 'PPT나 포스터 디자인',
        weights: { creative: 3, analytical: 0, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { 'Open-minded': 2, Communicator: 1 }
      },
      {
        label: 'B',
        text: '자료 조사와 내용 정리',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { Inquirer: 2, Knowledgeable: 2 }
      },
      {
        label: 'C',
        text: '발표자로 앞에서 설명',
        weights: { creative: 1, analytical: 0, caring: 0, leadership: 3, practical: 0 },
        ibWeights: { Communicator: 3, 'Risk-taker': 1 }
      },
      {
        label: 'D',
        text: '모형이나 실물 자료 제작',
        weights: { creative: 1, analytical: 0, caring: 0, leadership: 0, practical: 3 },
        ibWeights: { Balanced: 2, 'Risk-taker': 1 }
      }
    ]
  },
  // S5: 새 게임/취미 상황
  {
    id: 's5',
    text: '처음 보는 보드게임이 있어. 어떻게 할 것 같아?',
    type: 'situation',
    category: ['analytical', 'practical', 'leadership', 'creative'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '규칙을 꼼꼼히 읽어본다',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { Knowledgeable: 2, Thinker: 1 }
      },
      {
        label: 'B',
        text: '일단 해보면서 배운다',
        weights: { creative: 1, analytical: 0, caring: 0, leadership: 0, practical: 3 },
        ibWeights: { 'Risk-taker': 2, Inquirer: 1 }
      },
      {
        label: 'C',
        text: '아는 사람에게 설명을 듣는다',
        weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 2 },
        ibWeights: { Communicator: 2, 'Open-minded': 1 }
      },
      {
        label: 'D',
        text: '다른 사람들에게 규칙을 알려준다',
        weights: { creative: 0, analytical: 1, caring: 1, leadership: 2, practical: 0 },
        ibWeights: { Communicator: 2, Knowledgeable: 1 }
      }
    ]
  },
  // S6: 자유 시간 상황
  {
    id: 's6',
    text: '갑자기 자유 시간이 2시간 생겼어. 뭐 할래?',
    type: 'situation',
    category: ['creative', 'analytical', 'caring', 'practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '그림, 음악, 글쓰기 등 창작 활동',
        weights: { creative: 3, analytical: 0, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { 'Open-minded': 2, Reflective: 1 }
      },
      {
        label: 'B',
        text: '궁금했던 것 검색하거나 책 읽기',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 0, practical: 0 },
        ibWeights: { Inquirer: 3, Knowledgeable: 1 }
      },
      {
        label: 'C',
        text: '친구에게 연락하거나 만나기',
        weights: { creative: 0, analytical: 0, caring: 3, leadership: 0, practical: 0 },
        ibWeights: { Caring: 2, Communicator: 1 }
      },
      {
        label: 'D',
        text: '운동, 만들기, 요리 등 활동적인 것',
        weights: { creative: 1, analytical: 0, caring: 0, leadership: 0, practical: 3 },
        ibWeights: { Balanced: 2, 'Risk-taker': 1 }
      }
    ]
  },
  // S7: 새 학기 반장 선거 상황
  {
    id: 's7',
    text: '새 학기에 반장 선거가 있대. 어떻게 하고 싶어?',
    type: 'situation',
    category: ['leadership', 'caring', 'analytical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '직접 출마해서 반을 이끌고 싶다',
        weights: { creative: 0, analytical: 0, caring: 0, leadership: 3, practical: 0 },
        ibWeights: { 'Risk-taker': 3, Communicator: 1 }
      },
      {
        label: 'B',
        text: '반장을 도와 부반장이나 임원을 하고 싶다',
        weights: { creative: 0, analytical: 0, caring: 2, leadership: 2, practical: 0 },
        ibWeights: { Caring: 2, Principled: 1 }
      },
      {
        label: 'C',
        text: '특정 역할(도서, 환경 등)을 맡고 싶다',
        weights: { creative: 0, analytical: 1, caring: 1, leadership: 0, practical: 2 },
        ibWeights: { Balanced: 2, Principled: 1 }
      },
      {
        label: 'D',
        text: '임원보다는 내 일에 집중하고 싶다',
        weights: { creative: 1, analytical: 2, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { Reflective: 2, Thinker: 1 }
      }
    ]
  },
  // S8: 어려운 과제 상황
  {
    id: 's8',
    text: '어려운 과제를 받았는데 잘 모르겠어. 어떻게 할 것 같아?',
    type: 'situation',
    category: ['analytical', 'caring', 'practical', 'creative'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '관련 자료를 찾아 스스로 해결해본다',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { Inquirer: 3, Thinker: 1 }
      },
      {
        label: 'B',
        text: '친구나 선생님에게 물어본다',
        weights: { creative: 0, analytical: 0, caring: 2, leadership: 0, practical: 2 },
        ibWeights: { Communicator: 2, 'Open-minded': 1 }
      },
      {
        label: 'C',
        text: '나만의 방식으로 접근해본다',
        weights: { creative: 3, analytical: 0, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { 'Risk-taker': 2, Thinker: 1 }
      },
      {
        label: 'D',
        text: '비슷한 예제를 따라하며 배운다',
        weights: { creative: 0, analytical: 1, caring: 0, leadership: 0, practical: 3 },
        ibWeights: { Knowledgeable: 2, Balanced: 1 }
      }
    ]
  },
  // S9: 동아리 선택 상황
  {
    id: 's9',
    text: '학교에서 동아리를 선택해야 해. 어떤 게 끌려?',
    type: 'situation',
    category: ['creative', 'analytical', 'caring', 'leadership', 'practical'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '미술, 음악, 영상 등 예술 동아리',
        weights: { creative: 3, analytical: 0, caring: 0, leadership: 0, practical: 1 },
        ibWeights: { 'Open-minded': 2, Reflective: 1 }
      },
      {
        label: 'B',
        text: '과학, 수학, 토론 등 탐구 동아리',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 1, practical: 0 },
        ibWeights: { Inquirer: 2, Thinker: 2 }
      },
      {
        label: 'C',
        text: '봉사, 또래상담 등 돌봄 동아리',
        weights: { creative: 0, analytical: 0, caring: 3, leadership: 1, practical: 0 },
        ibWeights: { Caring: 3, Principled: 1 }
      },
      {
        label: 'D',
        text: '운동, 요리, 코딩 등 실습 동아리',
        weights: { creative: 1, analytical: 0, caring: 0, leadership: 0, practical: 3 },
        ibWeights: { Balanced: 2, 'Risk-taker': 1 }
      }
    ]
  },
  // S10: 팀 프로젝트 갈등 상황
  {
    id: 's10',
    text: '팀 프로젝트에서 의견이 갈렸어. 어떻게 할 것 같아?',
    type: 'situation',
    category: ['leadership', 'analytical', 'caring', 'creative'],
    weights: { creative: 0, analytical: 0, caring: 0, leadership: 0, practical: 0 },
    ibWeights: {},
    options: [
      {
        label: 'A',
        text: '각 의견의 장단점을 분석해 최선을 찾는다',
        weights: { creative: 0, analytical: 3, caring: 0, leadership: 1, practical: 0 },
        ibWeights: { Thinker: 3, Knowledgeable: 1 }
      },
      {
        label: 'B',
        text: '투표나 다수결로 빠르게 결정한다',
        weights: { creative: 0, analytical: 0, caring: 1, leadership: 3, practical: 0 },
        ibWeights: { Principled: 2, Communicator: 1 }
      },
      {
        label: 'C',
        text: '서로의 의견을 합친 새로운 아이디어를 제안한다',
        weights: { creative: 3, analytical: 0, caring: 1, leadership: 0, practical: 0 },
        ibWeights: { 'Open-minded': 2, 'Risk-taker': 1 }
      },
      {
        label: 'D',
        text: '각자 맡은 부분에서 자유롭게 하도록 한다',
        weights: { creative: 1, analytical: 0, caring: 2, leadership: 0, practical: 1 },
        ibWeights: { 'Open-minded': 2, Balanced: 1 }
      }
    ]
  }
];

// 정밀 검사용 전체 질문 (기존 24개 + 상황형 10개 = 34개)
export const FULL_ASSESSMENT_QUESTIONS: Question[] = [
  ...ASSESSMENT_QUESTIONS,
  ...SITUATION_QUESTIONS
];
