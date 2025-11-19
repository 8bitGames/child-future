import { ConsultationMode, ConsultationGuide } from '@/lib/types/result';

// 4가지 상담 모드별 가이드
export const CONSULTATION_GUIDES: Record<ConsultationMode, ConsultationGuide> = {
  'parent-to-child': {
    mode: 'parent-to-child',
    title: '부모가 아이와 상담할 때',
    description: '따뜻하고 호기심 많은 질문으로 아이의 생각을 이끌어 내세요',
    tips: [
      '아이의 관심사를 인정하고 구체적으로 격려해 주세요',
      '강점을 먼저 언급하며 대화를 시작하세요',
      '열린 질문으로 아이의 생각과 감정을 이끌어 내세요',
      '판단하지 말고 경청하는 자세를 보여주세요'
    ],
    exampleQuestions: [
      '너는 {activity}할 때 정말 눈이 반짝이네. 그때 어떤 기분이 들어?',
      '이 결과를 보니 {category}형 재능이 있는 것 같아. 너는 어떻게 생각해?',
      '이런 재능이 더 잘 자라려면 어떤 활동을 더 해보고 싶어?',
      '학교나 학원에서 이쪽으로 도전해볼 만한 게 뭐가 있을까, 우리 같이 찾아볼까?'
    ]
  },

  'teacher-to-child': {
    mode: 'teacher-to-child',
    title: '선생님이 아이와 상담할 때',
    description: '인정과 관찰을 바탕으로 구체적인 제안을 해주세요',
    tips: [
      '교실에서 관찰한 구체적인 사례를 언급하세요',
      '아이의 강점을 먼저 인정하고 칭찬하세요',
      '학교 활동과 연결해서 제안하세요',
      '다음 단계의 구체적인 행동을 제시하세요'
    ],
    exampleQuestions: [
      '수업 시간에 {activity}할 때, 친구들이 많이 도움을 받았던 거 기억나?',
      '이건 {category}형 성향이 잘 드러나는 부분이야. 선생님도 그렇게 생각해.',
      '내년에는 이 재능을 살릴 수 있는 동아리나 프로젝트에 참여해보는 건 어떨까?',
      '이 분야에서 더 성장하려면 어떤 도움이 필요할 것 같아?'
    ]
  },

  'teacher-to-parent': {
    mode: 'teacher-to-parent',
    title: '선생님이 부모님과 상담할 때',
    description: '객관적이고 긍정적인 관찰을 바탕으로 방향을 제시하세요',
    tips: [
      '검사 결과와 교실 관찰을 함께 제시하세요',
      '객관적인 사실과 구체적인 사례를 들어 설명하세요',
      '긍정적인 관점에서 강점을 먼저 이야기하세요',
      '가정에서 할 수 있는 구체적인 활동을 제안하세요'
    ],
    exampleQuestions: [
      '검사 결과와 교실 관찰을 함께 보면, {name}은/는 특히 {category1}과/와 {category2}이/가 강하게 나타납니다.',
      '{situation} 상황에서 {behavior} 모습이 자주 관찰됐어요.',
      '이쪽 성향이 잘 자라면, 나중에 {career_field} 분야에서 강점이 생길 수 있습니다.',
      '가정에서는 {activity} 같은 활동을 경험해보시면 좋겠습니다.'
    ]
  },

  'child-to-parent': {
    mode: 'child-to-parent',
    title: '아이가 부모님과 대화할 때',
    description: '아이가 자신의 생각을 표현할 수 있도록 도와주세요',
    tips: [
      '아이가 직접 말할 수 있게 문장 템플릿을 제공하세요',
      '긍정적이고 구체적인 표현을 사용하세요',
      '아이의 감정과 생각을 중심으로 이야기하세요',
      '부모님께 도움을 요청하는 방법을 알려주세요'
    ],
    exampleQuestions: [
      '나는 {activity} 활동을 할 때 제일 재미있었어.',
      '검사에서 나온 직업들 중에, 나는 {job}이/가 제일 마음에 들어.',
      '나는 {category}형 성향이 강하다고 나왔는데, 이게 나랑 잘 맞는 것 같아.',
      '이런 쪽으로 더 해보고 싶은데, 엄마/아빠가 도와줄 수 있어?'
    ]
  }
};

// 특정 상담 모드 가이드 가져오기
export function getConsultationGuide(mode: ConsultationMode): ConsultationGuide {
  return CONSULTATION_GUIDES[mode];
}

// 모든 상담 모드 목록
export function getAllConsultationModes(): ConsultationMode[] {
  return Object.keys(CONSULTATION_GUIDES) as ConsultationMode[];
}
