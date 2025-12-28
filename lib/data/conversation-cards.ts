import { IBProfile } from '@/lib/types/result';

export type Situation = 'meal' | 'bedtime' | 'travel' | 'play' | 'anytime';
export type CardCategory = 'question' | 'activity' | 'reflection';

export interface ConversationCard {
  id: string;
  question: string;
  situation: Situation;
  targetIBProfile: IBProfile;
  followUpTips: string[];
  ageRange: {
    min: number;
    max: number;
  };
  category: CardCategory;
}

export interface ConversationHistory {
  id: string;
  cardId: string;
  usedAt: string;
  notes?: string;
  favorite?: boolean;
}

export const SITUATION_INFO: Record<Situation, { label: string; emoji: string; description: string }> = {
  meal: { label: '식사시간', emoji: '🍽️', description: '함께 식사하며 나누는 대화' },
  bedtime: { label: '취침전', emoji: '🛏️', description: '하루를 마무리하며 나누는 대화' },
  travel: { label: '이동중', emoji: '🚗', description: '차 안이나 이동하며 나누는 대화' },
  play: { label: '놀이시간', emoji: '🎮', description: '함께 놀면서 나누는 대화' },
  anytime: { label: '언제든지', emoji: '💬', description: '상황에 관계없이 나눌 수 있는 대화' }
};

export const CATEGORY_INFO: Record<CardCategory, { label: string; emoji: string }> = {
  question: { label: '질문', emoji: '❓' },
  activity: { label: '활동', emoji: '🎯' },
  reflection: { label: '성찰', emoji: '🪞' }
};

// 대화 카드 데이터베이스
export const CONVERSATION_CARDS: ConversationCard[] = [
  // ========== 탐구하는 사람 (Inquirer) ==========
  // 식사시간
  {
    id: 'meal-inq-001',
    question: '오늘 학교에서 제일 궁금했던 건 뭐야?',
    situation: 'meal',
    targetIBProfile: 'Inquirer',
    followUpTips: [
      '그래서 어떻게 됐어?',
      '선생님한테 물어봤어?',
      '우리 같이 찾아볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'meal-inq-002',
    question: '이 음식은 어떻게 만들어졌을까?',
    situation: 'meal',
    targetIBProfile: 'Inquirer',
    followUpTips: [
      '재료가 어디서 왔을까?',
      '우리도 같이 만들어볼까?',
      '다른 나라에서는 어떻게 먹을까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  // 취침전
  {
    id: 'bed-inq-001',
    question: '오늘 새롭게 알게 된 게 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Inquirer',
    followUpTips: [
      '어떻게 알게 됐어?',
      '더 알고 싶은 건 뭐야?',
      '내일 또 알아보고 싶은 게 있어?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  // 이동중
  {
    id: 'travel-inq-001',
    question: '저기 보이는 것들 중에 궁금한 거 있어?',
    situation: 'travel',
    targetIBProfile: 'Inquirer',
    followUpTips: [
      '왜 그렇게 생겼을까?',
      '누가 만들었을까?',
      '집에 가서 찾아볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  // 언제든지
  {
    id: 'any-inq-001',
    question: '요즘 제일 알고 싶은 게 뭐야?',
    situation: 'anytime',
    targetIBProfile: 'Inquirer',
    followUpTips: [
      '왜 그게 궁금해졌어?',
      '어떻게 알아볼 수 있을까?',
      '같이 책이나 영상을 찾아볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 지식을 쌓는 사람 (Knowledgeable) ==========
  {
    id: 'meal-know-001',
    question: '오늘 배운 것 중에 재미있었던 건 뭐야?',
    situation: 'meal',
    targetIBProfile: 'Knowledgeable',
    followUpTips: [
      '그거 나한테도 알려줄래?',
      '어디서 배웠어?',
      '더 알고 싶은 부분은?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'bed-know-001',
    question: '오늘 읽은 책이나 본 영상 중에 기억나는 거 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Knowledgeable',
    followUpTips: [
      '어떤 내용이었어?',
      '제일 인상 깊은 부분은?',
      '비슷한 내용 더 찾아볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'any-know-001',
    question: '친구들한테 알려주고 싶은 재미있는 사실이 있어?',
    situation: 'anytime',
    targetIBProfile: 'Knowledgeable',
    followUpTips: [
      '어떻게 알게 됐어?',
      '친구들은 뭐라고 했어?',
      '나한테도 알려줘!'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 생각하는 사람 (Thinker) ==========
  {
    id: 'meal-think-001',
    question: '만약 한 가지 소원이 이루어진다면 뭘 빌겠어?',
    situation: 'meal',
    targetIBProfile: 'Thinker',
    followUpTips: [
      '왜 그걸 빌고 싶어?',
      '그게 이루어지면 어떨 것 같아?',
      '다른 방법으로 이룰 수는 없을까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'bed-think-001',
    question: '오늘 어려웠던 일이 있었어? 어떻게 해결했어?',
    situation: 'bedtime',
    targetIBProfile: 'Thinker',
    followUpTips: [
      '다른 방법은 없었을까?',
      '다음엔 어떻게 하면 좋을까?',
      '도움이 필요했던 건 아니야?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'travel-think-001',
    question: '저기 있는 건물은 왜 저렇게 생겼을까?',
    situation: 'travel',
    targetIBProfile: 'Thinker',
    followUpTips: [
      '다르게 만들면 어떨 것 같아?',
      '네가 만든다면 어떻게 만들겠어?',
      '어떤 사람들이 사용할까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'play-think-001',
    question: '이 게임의 규칙을 바꾼다면 어떻게 바꿀래?',
    situation: 'play',
    targetIBProfile: 'Thinker',
    followUpTips: [
      '왜 그렇게 바꾸면 좋을까?',
      '더 재미있어질까?',
      '한번 해볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'activity'
  },
  {
    id: 'any-think-001',
    question: '왜 그렇게 생각해?',
    situation: 'anytime',
    targetIBProfile: 'Thinker',
    followUpTips: [
      '다른 관점에서 보면 어떨까?',
      '다른 사람은 어떻게 생각할까?',
      '더 좋은 방법이 있을까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 소통하는 사람 (Communicator) ==========
  {
    id: 'meal-comm-001',
    question: '오늘 친구랑 무슨 이야기 했어?',
    situation: 'meal',
    targetIBProfile: 'Communicator',
    followUpTips: [
      '재미있었겠다!',
      '친구는 뭐라고 했어?',
      '그래서 기분이 어땠어?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'bed-comm-001',
    question: '오늘 누군가한테 고마웠던 일이 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Communicator',
    followUpTips: [
      '고맙다고 말했어?',
      '어떤 말을 해주고 싶어?',
      '내일 한번 말해보면 어떨까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'play-comm-001',
    question: '내가 이야기하나 해줄까? 아니면 네가 해줄래?',
    situation: 'play',
    targetIBProfile: 'Communicator',
    followUpTips: [
      '정말 재미있는 이야기구나!',
      '그 다음엔 어떻게 됐어?',
      '주인공 이름은 뭐야?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'activity'
  },
  {
    id: 'any-comm-001',
    question: '요즘 가장 친한 친구는 누구야?',
    situation: 'anytime',
    targetIBProfile: 'Communicator',
    followUpTips: [
      '그 친구가 좋은 이유가 뭐야?',
      '같이 뭐 하면서 놀아?',
      '친구가 되려면 어떻게 해야 할까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 원칙을 지키는 사람 (Principled) ==========
  {
    id: 'meal-prin-001',
    question: '오늘 친구한테 정직하게 행동한 일이 있어?',
    situation: 'meal',
    targetIBProfile: 'Principled',
    followUpTips: [
      '어떤 일이었어?',
      '쉽지 않았을 텐데 잘했어!',
      '정직하게 하니까 기분이 어땠어?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'bed-prin-001',
    question: '오늘 약속을 잘 지켰어?',
    situation: 'bedtime',
    targetIBProfile: 'Principled',
    followUpTips: [
      '어떤 약속이었어?',
      '지키기 힘들지 않았어?',
      '내일은 어떤 약속을 지켜볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'any-prin-001',
    question: '규칙이 왜 필요하다고 생각해?',
    situation: 'anytime',
    targetIBProfile: 'Principled',
    followUpTips: [
      '규칙이 없으면 어떻게 될까?',
      '네가 만들고 싶은 규칙이 있어?',
      '가장 중요한 규칙은 뭘까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 열린 마음을 가진 사람 (Open-minded) ==========
  {
    id: 'meal-open-001',
    question: '오늘 처음 먹어보는 음식이 있으면 도전해볼까?',
    situation: 'meal',
    targetIBProfile: 'Open-minded',
    followUpTips: [
      '맛이 어때?',
      '어떤 나라 음식일까?',
      '다음에도 또 먹어볼래?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'activity'
  },
  {
    id: 'bed-open-001',
    question: '오늘 새로운 것을 경험한 게 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Open-minded',
    followUpTips: [
      '기분이 어땠어?',
      '또 해보고 싶어?',
      '내일은 뭘 새로 해볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'travel-open-001',
    question: '여기 사는 사람들은 어떤 생활을 할까?',
    situation: 'travel',
    targetIBProfile: 'Open-minded',
    followUpTips: [
      '우리랑 다른 점이 있을까?',
      '여기서 살면 어떨 것 같아?',
      '다른 나라는 어떨까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'any-open-001',
    question: '다른 나라에 대해 알고 싶은 게 있어?',
    situation: 'anytime',
    targetIBProfile: 'Open-minded',
    followUpTips: [
      '왜 그 나라가 궁금해?',
      '그 나라 사람들은 어떻게 인사할까?',
      '같이 찾아볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 배려하는 사람 (Caring) ==========
  {
    id: 'meal-care-001',
    question: '오늘 누군가를 도와준 일이 있어?',
    situation: 'meal',
    targetIBProfile: 'Caring',
    followUpTips: [
      '그 사람이 뭐라고 했어?',
      '도와주니까 기분이 어땠어?',
      '정말 따뜻한 마음이구나!'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'bed-care-001',
    question: '오늘 친구가 힘들어 보인 적 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Caring',
    followUpTips: [
      '어떻게 해줬어?',
      '내일 또 도와줄 수 있을까?',
      '친구가 기뻐했을 것 같아'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'play-care-001',
    question: '우리 같이 놀 때 서로 양보하면서 놀아볼까?',
    situation: 'play',
    targetIBProfile: 'Caring',
    followUpTips: [
      '양보하니까 기분이 어때?',
      '친구도 양보해줬어?',
      '같이 하니까 더 재미있지?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'activity'
  },
  {
    id: 'any-care-001',
    question: '가족 중에 오늘 특별히 챙겨주고 싶은 사람 있어?',
    situation: 'anytime',
    targetIBProfile: 'Caring',
    followUpTips: [
      '어떻게 챙겨줄 수 있을까?',
      '직접 말해보는 건 어때?',
      '작은 것도 큰 힘이 될 수 있어!'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 도전하는 사람 (Risk-taker) ==========
  {
    id: 'meal-risk-001',
    question: '오늘 용기 냈던 일이 있어?',
    situation: 'meal',
    targetIBProfile: 'Risk-taker',
    followUpTips: [
      '어떤 일이었어?',
      '용기 내니까 어땠어?',
      '다음에도 할 수 있겠어?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'bed-risk-001',
    question: '내일 도전해보고 싶은 게 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Risk-taker',
    followUpTips: [
      '왜 그걸 도전하고 싶어?',
      '무서운 건 없어?',
      '어떻게 하면 잘할 수 있을까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'play-risk-001',
    question: '새로운 놀이 방법을 만들어볼까?',
    situation: 'play',
    targetIBProfile: 'Risk-taker',
    followUpTips: [
      '규칙을 바꿔볼까?',
      '다른 도구를 써보면 어떨까?',
      '완전 새로운 게임을 만들어볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'activity'
  },
  {
    id: 'any-risk-001',
    question: '해보고 싶은데 무서워서 못한 게 있어?',
    situation: 'anytime',
    targetIBProfile: 'Risk-taker',
    followUpTips: [
      '뭐가 무서워?',
      '같이 해볼까?',
      '작은 것부터 시작해보면 어떨까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 균형 잡힌 사람 (Balanced) ==========
  {
    id: 'meal-bal-001',
    question: '오늘 몸을 움직인 활동은 뭐가 있었어?',
    situation: 'meal',
    targetIBProfile: 'Balanced',
    followUpTips: [
      '재미있었어?',
      '몸이 건강해지는 것 같아?',
      '내일도 해볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },
  {
    id: 'bed-bal-001',
    question: '오늘 하루 공부, 운동, 놀이 다 했어?',
    situation: 'bedtime',
    targetIBProfile: 'Balanced',
    followUpTips: [
      '뭐가 제일 재미있었어?',
      '빠진 건 없어?',
      '내일은 뭘 더 하고 싶어?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'play-bal-001',
    question: '조용한 놀이랑 움직이는 놀이 번갈아서 해볼까?',
    situation: 'play',
    targetIBProfile: 'Balanced',
    followUpTips: [
      '어떤 게 더 좋아?',
      '둘 다 재미있지?',
      '균형 맞추니까 어때?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'activity'
  },
  {
    id: 'any-bal-001',
    question: '요즘 너무 많이 하는 것 같은 게 있어?',
    situation: 'anytime',
    targetIBProfile: 'Balanced',
    followUpTips: [
      '왜 그렇게 생각해?',
      '다른 것도 해보면 어떨까?',
      '시간을 나눠볼까?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  },

  // ========== 성찰하는 사람 (Reflective) ==========
  {
    id: 'meal-ref-001',
    question: '오늘 제일 좋았던 순간은 언제야?',
    situation: 'meal',
    targetIBProfile: 'Reflective',
    followUpTips: [
      '왜 그 순간이 좋았어?',
      '또 그런 순간을 만들려면?',
      '누구와 함께였어?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'bed-ref-001',
    question: '오늘 하루 중 제일 뿌듯했던 순간은?',
    situation: 'bedtime',
    targetIBProfile: 'Reflective',
    followUpTips: [
      '왜 그게 뿌듯했어?',
      '내일도 그런 기분 느끼고 싶으면 뭘 하면 좋을까?',
      '스스로 대견하지?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'bed-ref-002',
    question: '오늘 달랐으면 했던 일이 있어?',
    situation: 'bedtime',
    targetIBProfile: 'Reflective',
    followUpTips: [
      '어떻게 하면 좋았을까?',
      '다음에는 어떻게 할 거야?',
      '실수해도 괜찮아, 배우는 거야'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'reflection'
  },
  {
    id: 'any-ref-001',
    question: '요즘 네가 성장한 것 같은 부분이 있어?',
    situation: 'anytime',
    targetIBProfile: 'Reflective',
    followUpTips: [
      '어떻게 성장한 것 같아?',
      '누가 도와줬어?',
      '더 성장하고 싶은 부분은?'
    ],
    ageRange: { min: 6, max: 12 },
    category: 'question'
  }
];

// 특정 상황과 IB 프로필에 맞는 카드 필터링
export function getFilteredCards(
  situation?: Situation,
  ibProfile?: IBProfile,
  age?: number
): ConversationCard[] {
  return CONVERSATION_CARDS.filter(card => {
    const situationMatch = !situation || card.situation === situation;
    const profileMatch = !ibProfile || card.targetIBProfile === ibProfile;
    const ageMatch = !age || (age >= card.ageRange.min && age <= card.ageRange.max);
    return situationMatch && profileMatch && ageMatch;
  });
}

// 랜덤 카드 선택
export function getRandomCard(cards: ConversationCard[]): ConversationCard | null {
  if (cards.length === 0) return null;
  return cards[Math.floor(Math.random() * cards.length)];
}

// 사용 기록에 없는 카드만 필터링
export function getUnusedCards(
  cards: ConversationCard[],
  history: ConversationHistory[]
): ConversationCard[] {
  const usedIds = new Set(history.map(h => h.cardId));
  return cards.filter(card => !usedIds.has(card.id));
}
