import { IBProfile } from '@/lib/types/result';
import { CareerCategory } from '@/lib/types/assessment';

// IB 학습자상 공식 정의 (출처: IBO - International Baccalaureate Organization)
// https://www.ibo.org/benefits/learner-profile/
export interface IBProfileDefinition {
  id: IBProfile;
  nameEn: string;
  nameKo: string;
  definition: string;
  definitionEn: string;
  characteristics: string[];
  relatedCategories: CareerCategory[];
  icon: string;
  educationMethods: {
    parentGuide: string[];
    teacherGuide: string[];
    activities: string[];
    avoidBehaviors: string[];
  };
}

export const IB_PROFILE_DATABASE: IBProfileDefinition[] = [
  {
    id: 'Inquirer',
    nameEn: 'Inquirers',
    nameKo: '탐구하는 사람',
    definition: '우리는 호기심을 기르고, 탐구와 연구를 위한 기술을 개발합니다. 독립적으로, 그리고 다른 사람들과 함께 배우는 방법을 알고 있습니다. 열정을 가지고 배우며 평생 학습에 대한 사랑을 유지합니다.',
    definitionEn: 'We nurture our curiosity, developing skills for inquiry and research. We know how to learn independently and with others. We learn with enthusiasm and sustain our love of learning throughout life.',
    characteristics: [
      '호기심이 강하고 질문을 많이 함',
      '스스로 탐구하고 연구하는 것을 즐김',
      '새로운 것을 배우는 데 열정적임',
      '독립적 학습과 협력 학습 모두 가능'
    ],
    relatedCategories: ['analytical', 'creative'],
    icon: '🔍',
    educationMethods: {
      parentGuide: [
        '아이의 "왜?"라는 질문에 성의있게 답해주세요',
        '함께 답을 찾아가는 과정을 즐기세요',
        '도서관, 박물관, 과학관 등 탐구할 수 있는 환경을 제공하세요',
        '실패해도 괜찮다는 것을 알려주고 다시 시도하도록 격려하세요'
      ],
      teacherGuide: [
        '탐구 기반 학습(Inquiry-based learning) 방법을 활용하세요',
        '정답보다 질문하는 과정을 칭찬해주세요',
        '학생이 직접 가설을 세우고 검증하는 기회를 제공하세요',
        '다양한 정보 출처를 비교하고 평가하는 방법을 가르치세요'
      ],
      activities: [
        '과학 실험 및 관찰 일지 작성',
        '주제별 탐구 프로젝트 수행',
        '자연 탐사 및 필드 트립',
        '온라인 리서치 및 발표'
      ],
      avoidBehaviors: [
        '질문을 무시하거나 "몰라"라고만 답하기',
        '정해진 답만 강요하기',
        '실수를 심하게 꾸짖기',
        '아이의 관심사를 무시하기'
      ]
    }
  },
  {
    id: 'Knowledgeable',
    nameEn: 'Knowledgeable',
    nameKo: '지식이 있는 사람',
    definition: '우리는 다양한 학문 분야를 탐구하며 개념적 이해를 발전시킵니다. 지역적, 세계적으로 중요한 아이디어와 이슈에 대해 깊고 균형 잡힌 이해를 추구합니다.',
    definitionEn: 'We develop and use conceptual understanding, exploring knowledge across a range of disciplines. We engage with issues and ideas that have local and global significance.',
    characteristics: [
      '다양한 분야의 지식을 습득함',
      '개념적 이해력이 뛰어남',
      '지역 및 글로벌 이슈에 관심을 가짐',
      '학제간 연결을 잘 만듦'
    ],
    relatedCategories: ['analytical', 'leadership'],
    icon: '📚',
    educationMethods: {
      parentGuide: [
        '다양한 주제의 책과 자료를 제공하세요',
        '뉴스나 시사 이슈에 대해 대화를 나누세요',
        '여러 분야의 연결고리를 찾아보도록 도와주세요',
        '지역사회 문제에 관심을 갖도록 격려하세요'
      ],
      teacherGuide: [
        '학제간 연계 학습을 설계하세요',
        '실제 세계의 문제와 연결된 학습 경험을 제공하세요',
        '다양한 관점에서 주제를 탐구하도록 안내하세요',
        '개념 맵이나 마인드맵을 활용한 학습을 촉진하세요'
      ],
      activities: [
        '다양한 장르의 독서 및 독서 토론',
        '시사 이슈 탐구 및 발표',
        '주제 통합 프로젝트',
        '지역사회 문제 해결 활동'
      ],
      avoidBehaviors: [
        '한 분야에만 집중하도록 강요하기',
        '암기 위주의 학습만 요구하기',
        '아이의 다양한 관심사를 무시하기',
        '세상일에 관심 갖는 것을 막기'
      ]
    }
  },
  {
    id: 'Thinker',
    nameEn: 'Thinkers',
    nameKo: '생각하는 사람',
    definition: '우리는 비판적이고 창의적인 사고력을 사용하여 복잡한 문제를 분석하고 책임감 있는 행동을 합니다. 우리는 윤리적이고 합리적인 결정을 내리기 위해 주도적으로 노력합니다.',
    definitionEn: 'We use critical and creative thinking skills to analyse and take responsible action on complex problems. We exercise initiative in making reasoned, ethical decisions.',
    characteristics: [
      '비판적 사고력이 뛰어남',
      '창의적으로 문제를 해결함',
      '복잡한 문제를 분석할 수 있음',
      '윤리적 결정을 내림'
    ],
    relatedCategories: ['analytical', 'creative'],
    icon: '💭',
    educationMethods: {
      parentGuide: [
        '일상에서 선택의 이유를 물어보세요',
        '다양한 해결책을 함께 브레인스토밍하세요',
        '윤리적 딜레마에 대해 대화를 나누세요',
        '결정의 결과를 예측해보는 습관을 들이세요'
      ],
      teacherGuide: [
        '정답이 없는 열린 질문을 활용하세요',
        '문제 해결 과정을 단계별로 안내하세요',
        '다양한 관점에서 문제를 바라보도록 촉진하세요',
        '창의적 사고 기법(SCAMPER, 6 Thinking Hats 등)을 활용하세요'
      ],
      activities: [
        '퍼즐, 논리 게임, 전략 게임',
        '토론 및 디베이트',
        '창의적 글쓰기 및 스토리텔링',
        '디자인 씽킹 프로젝트'
      ],
      avoidBehaviors: [
        '항상 정답만 요구하기',
        '생각할 시간을 주지 않기',
        '아이의 의견을 무시하기',
        '실수를 용납하지 않기'
      ]
    }
  },
  {
    id: 'Communicator',
    nameEn: 'Communicators',
    nameKo: '소통하는 사람',
    definition: '우리는 하나 이상의 언어와 다양한 방식으로 자신감 있고 창의적으로 자신을 표현합니다. 다른 개인이나 그룹의 관점을 주의 깊게 경청하며 효과적으로 협력합니다.',
    definitionEn: 'We express ourselves confidently and creatively in more than one language and in many ways. We collaborate effectively, listening carefully to the perspectives of other individuals and groups.',
    characteristics: [
      '자신의 생각을 명확하게 표현함',
      '다양한 방식으로 의사소통함',
      '경청을 잘하고 협력적임',
      '다른 관점을 존중함'
    ],
    relatedCategories: ['leadership', 'caring'],
    icon: '💬',
    educationMethods: {
      parentGuide: [
        '가족 대화 시간을 정기적으로 가지세요',
        '아이의 말을 끝까지 경청해주세요',
        '다양한 표현 방식(글, 그림, 연극 등)을 격려하세요',
        '외국어 학습 기회를 제공하세요'
      ],
      teacherGuide: [
        '다양한 발표 기회를 제공하세요',
        '협력 학습과 그룹 프로젝트를 활용하세요',
        '경청 기술을 명시적으로 가르치세요',
        '다양한 미디어를 활용한 표현 활동을 설계하세요'
      ],
      activities: [
        '연극, 역할극, 스피치',
        '글쓰기 및 저널링',
        '외국어 학습 및 언어 교환',
        '팟캐스트나 영상 제작'
      ],
      avoidBehaviors: [
        '아이의 말을 끊거나 무시하기',
        '특정 표현 방식만 인정하기',
        '실수를 비웃거나 창피주기',
        '혼자 하는 활동만 강요하기'
      ]
    }
  },
  {
    id: 'Principled',
    nameEn: 'Principled',
    nameKo: '원칙을 지키는 사람',
    definition: '우리는 정직하고 성실하게 행동하며, 공정성과 정의에 대한 강한 감각을 가지고 있습니다. 모든 사람의 존엄성과 권리를 존중하며, 우리의 행동과 그 결과에 대해 책임을 집니다.',
    definitionEn: 'We act with integrity and honesty, with a strong sense of fairness and justice, and with respect for the dignity and rights of people everywhere. We take responsibility for our actions and their consequences.',
    characteristics: [
      '정직하고 성실함',
      '공정성과 정의를 중시함',
      '타인의 존엄성을 존중함',
      '책임감이 강함'
    ],
    relatedCategories: ['leadership', 'caring'],
    icon: '⚖️',
    educationMethods: {
      parentGuide: [
        '정직한 행동의 모범을 보여주세요',
        '규칙과 약속의 이유를 설명해주세요',
        '실수했을 때 인정하고 책임지는 모습을 보여주세요',
        '공정한 대우와 기회에 대해 이야기하세요'
      ],
      teacherGuide: [
        '학급 규칙을 함께 만들고 이유를 토론하세요',
        '윤리적 딜레마 토론 시간을 가지세요',
        '책임감 있는 행동을 인정하고 칭찬하세요',
        '불공정한 상황에 대한 인식을 높이세요'
      ],
      activities: [
        '모의 재판 및 윤리 토론',
        '봉사 활동 참여',
        '역사적 정의 사례 탐구',
        '학급/가정 규칙 만들기'
      ],
      avoidBehaviors: [
        '거짓말이나 불공정한 행동 묵인하기',
        '일관성 없는 규칙 적용하기',
        '책임을 다른 사람에게 전가하기',
        '"규칙이니까"라고만 설명하기'
      ]
    }
  },
  {
    id: 'Open-minded',
    nameEn: 'Open-minded',
    nameKo: '열린 마음을 가진 사람',
    definition: '우리는 자신의 문화와 개인적 역사뿐만 아니라 다른 사람들의 가치와 전통을 비판적으로 이해합니다. 다양한 관점을 찾고 평가하며, 경험을 통해 성장할 준비가 되어 있습니다.',
    definitionEn: 'We critically appreciate our own cultures and personal histories, as well as the values and traditions of others. We seek and evaluate a range of points of view, and we are willing to grow from the experience.',
    characteristics: [
      '다양한 문화와 전통을 존중함',
      '다른 관점을 열린 마음으로 수용함',
      '새로운 경험에서 배움을 찾음',
      '편견 없이 생각함'
    ],
    relatedCategories: ['caring', 'creative'],
    icon: '🌍',
    educationMethods: {
      parentGuide: [
        '다양한 문화의 음식, 음악, 축제를 경험하게 하세요',
        '다른 의견에 대해 "왜 그렇게 생각하니?"라고 물어보세요',
        '편견이나 고정관념에 대해 이야기하세요',
        '새로운 경험에 도전하도록 격려하세요'
      ],
      teacherGuide: [
        '다문화 교육 자료를 활용하세요',
        '다양한 관점을 대표하는 자료를 선정하세요',
        '학생들이 서로의 배경을 공유하는 기회를 만드세요',
        '비판적으로 자신의 가정을 검토하도록 안내하세요'
      ],
      activities: [
        '다문화 체험 및 축제 참여',
        '세계 문학 및 영화 탐구',
        '펜팔 또는 온라인 교류',
        '자신의 고정관념 돌아보기'
      ],
      avoidBehaviors: [
        '다른 문화를 비하하거나 무시하기',
        '자기 방식만이 옳다고 주장하기',
        '새로운 것을 시도하지 않기',
        '차이를 부정적으로 표현하기'
      ]
    }
  },
  {
    id: 'Caring',
    nameEn: 'Caring',
    nameKo: '배려하는 사람',
    definition: '우리는 공감, 연민, 존중을 보여줍니다. 봉사에 대한 헌신이 있으며, 다른 사람들의 삶과 우리 주변 세상에 긍정적인 변화를 만들기 위해 행동합니다.',
    definitionEn: 'We show empathy, compassion and respect. We have a commitment to service, and we act to make a positive difference in the lives of others and in the world around us.',
    characteristics: [
      '공감 능력이 뛰어남',
      '다른 사람을 돕고 싶어함',
      '봉사 정신이 있음',
      '주변에 긍정적 영향을 줌'
    ],
    relatedCategories: ['caring', 'leadership'],
    icon: '❤️',
    educationMethods: {
      parentGuide: [
        '타인의 감정에 대해 이야기하는 시간을 가지세요',
        '함께 봉사활동에 참여하세요',
        '배려하는 행동을 구체적으로 칭찬해주세요',
        '동물이나 식물을 돌보는 경험을 제공하세요'
      ],
      teacherGuide: [
        '사회-정서 학습(SEL)을 교육과정에 통합하세요',
        '서비스 러닝 프로젝트를 설계하세요',
        '공감 능력을 키우는 활동을 포함하세요',
        '친절한 행동을 인정하고 강화하세요'
      ],
      activities: [
        '지역사회 봉사활동',
        '또래 멘토링',
        '환경 보호 프로젝트',
        '공감 일기 쓰기'
      ],
      avoidBehaviors: [
        '타인의 감정을 무시하기',
        '경쟁만 강조하기',
        '도움 요청을 거절하기',
        '이기적인 행동을 방관하기'
      ]
    }
  },
  {
    id: 'Risk-taker',
    nameEn: 'Risk-takers',
    nameKo: '도전하는 사람',
    definition: '우리는 불확실성에 용기와 신중함을 가지고 접근합니다. 새로운 아이디어와 혁신적인 전략을 탐구하기 위해 독립적으로, 그리고 협력하여 일합니다. 도전과 변화에 직면할 때 자원이 풍부하고 회복력이 있습니다.',
    definitionEn: 'We approach uncertainty with forethought and determination; we work independently and cooperatively to explore new ideas and innovative strategies. We are resourceful and resilient in the face of challenges and change.',
    characteristics: [
      '새로운 도전을 두려워하지 않음',
      '혁신적인 아이디어를 탐구함',
      '회복력이 강함',
      '불확실성을 용기 있게 대면함'
    ],
    relatedCategories: ['leadership', 'practical', 'creative'],
    icon: '🚀',
    educationMethods: {
      parentGuide: [
        '안전한 범위 내에서 새로운 도전을 격려하세요',
        '실패를 학습의 기회로 재구성해주세요',
        '위험을 평가하는 방법을 가르쳐주세요',
        '아이의 용기 있는 시도를 칭찬하세요'
      ],
      teacherGuide: [
        '안전한 실패 환경을 조성하세요',
        '도전적인 과제를 제공하되 지원을 아끼지 마세요',
        '회복력과 성장 마인드셋을 가르치세요',
        '혁신적인 프로젝트 기회를 제공하세요'
      ],
      activities: [
        '새로운 스포츠나 취미 도전',
        '창업 아이디어 대회',
        '아웃도어 모험 활동',
        '실패에서 배우기 프로젝트'
      ],
      avoidBehaviors: [
        '실패를 심하게 비난하기',
        '모든 위험을 차단하기',
        '항상 안전한 선택만 강요하기',
        '도전을 포기하도록 유도하기'
      ]
    }
  },
  {
    id: 'Balanced',
    nameEn: 'Balanced',
    nameKo: '균형 잡힌 사람',
    definition: '우리는 지적, 신체적, 정서적 균형이 자신과 타인의 웰빙에 중요하다는 것을 이해합니다. 우리는 다른 사람들과 우리가 사는 세상과의 상호의존성을 인식합니다.',
    definitionEn: 'We understand the importance of balancing different aspects of our lives—intellectual, physical, and emotional—to achieve well-being for ourselves and others. We recognize our interdependence with other people and with the world in which we live.',
    characteristics: [
      '지적, 신체적, 정서적 균형을 추구함',
      '웰빙의 중요성을 이해함',
      '다양한 활동에 참여함',
      '상호의존성을 인식함'
    ],
    relatedCategories: ['practical', 'caring'],
    icon: '⚖️',
    educationMethods: {
      parentGuide: [
        '공부, 운동, 휴식의 균형 잡힌 일과를 만들어주세요',
        '감정을 표현하고 관리하는 방법을 가르쳐주세요',
        '가족 시간과 개인 시간의 균형을 존중하세요',
        '스트레스 해소 방법을 함께 찾아보세요'
      ],
      teacherGuide: [
        '신체 활동을 학습에 통합하세요',
        '마음챙김이나 명상 시간을 포함하세요',
        '다양한 유형의 학습 경험을 제공하세요',
        '학생의 웰빙을 정기적으로 확인하세요'
      ],
      activities: [
        '운동과 요가',
        '마음챙김 및 명상',
        '일기 쓰기 및 감정 기록',
        '균형 잡힌 시간표 만들기'
      ],
      avoidBehaviors: [
        '한 가지에만 과도하게 집중시키기',
        '감정 표현을 억압하기',
        '휴식 시간을 주지 않기',
        '건강한 생활 습관을 무시하기'
      ]
    }
  },
  {
    id: 'Reflective',
    nameEn: 'Reflective',
    nameKo: '성찰하는 사람',
    definition: '우리는 세상과 우리 자신의 생각과 경험을 신중하게 고려합니다. 우리의 학습과 개인적 발전을 지원하기 위해 우리의 강점과 약점을 이해하려고 노력합니다.',
    definitionEn: 'We thoughtfully consider the world and our own ideas and experience. We work to understand our strengths and weaknesses in order to support our learning and personal development.',
    characteristics: [
      '자신의 행동과 생각을 돌아봄',
      '강점과 약점을 파악함',
      '경험에서 배움을 찾음',
      '지속적인 자기 개선을 추구함'
    ],
    relatedCategories: ['analytical', 'caring'],
    icon: '🪞',
    educationMethods: {
      parentGuide: [
        '하루를 돌아보는 대화 시간을 가지세요',
        '"오늘 무엇을 배웠니?"라고 물어보세요',
        '자신의 성찰 과정을 모델링해주세요',
        '목표 설정과 검토를 함께 하세요'
      ],
      teacherGuide: [
        '학습 일지나 포트폴리오를 활용하세요',
        '자기 평가 기회를 정기적으로 제공하세요',
        '성찰적 질문을 수업에 포함하세요',
        '피드백을 주고 성장 과정을 강조하세요'
      ],
      activities: [
        '성찰 일기 쓰기',
        '목표 설정 및 진행 상황 검토',
        '포트폴리오 구성',
        '자기 평가 및 동료 평가'
      ],
      avoidBehaviors: [
        '성찰 없이 다음으로 넘어가기',
        '결과만 강조하기',
        '자기 인식을 방해하기',
        '실수를 빠르게 잊어버리기'
      ]
    }
  }
];

// 직업군과 IB 학습자상 매핑
export const CATEGORY_TO_IB_MAPPING: Record<CareerCategory, IBProfile[]> = {
  creative: ['Inquirer', 'Thinker', 'Risk-taker', 'Open-minded'],
  analytical: ['Inquirer', 'Thinker', 'Knowledgeable', 'Reflective'],
  caring: ['Caring', 'Communicator', 'Principled', 'Open-minded'],
  leadership: ['Communicator', 'Principled', 'Risk-taker', 'Knowledgeable'],
  practical: ['Risk-taker', 'Balanced', 'Reflective']
};

// 학습자상 정보 가져오기
export function getIBProfileDefinition(profileId: IBProfile): IBProfileDefinition | undefined {
  return IB_PROFILE_DATABASE.find(p => p.id === profileId);
}

// 직업군에 맞는 IB 학습자상 추천
export function getRecommendedIBProfiles(categories: CareerCategory[]): IBProfile[] {
  const profiles = new Set<IBProfile>();

  categories.forEach(category => {
    CATEGORY_TO_IB_MAPPING[category].forEach(profile => {
      profiles.add(profile);
    });
  });

  return Array.from(profiles).slice(0, 3);
}

// 출처 정보
export const IB_SOURCE = {
  organization: 'International Baccalaureate Organization (IBO)',
  url: 'https://www.ibo.org/benefits/learner-profile/',
  document: 'IB Learner Profile (2017)',
  documentUrl: 'https://www.ibo.org/globalassets/new-structure/digital-toolkit/pdfs/learner-profile-2017-en.pdf',
  description: 'IB 학습자상은 IB World School에서 중요하게 여기는 10가지 특성을 나타냅니다. 이러한 특성은 개인과 그룹이 지역, 국가 및 세계 공동체의 책임감 있는 구성원이 되도록 돕습니다.'
};
