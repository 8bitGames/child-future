/**
 * IB 학습자상 확장 프로필 데이터
 * PDF "IB 학습자상 상세 분석 및 판별 가이드" 기반
 */

import { EnhancedIBProfile } from '@/lib/types/ib-enhanced';

export const ENHANCED_IB_PROFILES: EnhancedIBProfile[] = [
  {
    id: 'Inquirer',
    nameKo: '탐구하는 사람',
    nameEn: 'Inquirers',
    icon: '🔍',
    definition: '우리는 호기심을 기르고, 탐구와 연구를 위한 기술을 개발합니다. 독립적으로, 그리고 다른 사람들과 함께 배우는 방법을 알고 있습니다.',
    definitionEn: 'We nurture our curiosity, developing skills for inquiry and research. We know how to learn independently and with others.',
    characteristics: [
      '호기심이 강하고 질문을 많이 함',
      '스스로 탐구하고 연구하는 것을 즐김',
      '새로운 것을 배우는 데 열정적임',
      '독립적 학습과 협력 학습 모두 가능'
    ],
    relatedCategories: ['analytical', 'creative'],
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
    },
    theoreticalBasis: {
      coreEssence: '본능적 호기심을 체계적 탐구 역량으로 발전시키는 학습자의 핵심 특성',
      psychologicalFoundation: 'Piaget의 인지발달이론에서 강조하는 능동적 지식 구성과 Dewey의 경험학습론의 탐구 기반 학습',
      developmentalImportance: '평생학습의 기초가 되는 자기주도적 학습 능력과 비판적 사고력 형성에 결정적 역할',
      keyResearchers: ['Jean Piaget', 'John Dewey', 'Jerome Bruner']
    },
    behavioralIndicators: [
      {
        id: 'INQ-COG-01',
        category: 'cognitive',
        indicator: '자발적으로 질문을 생성하고 답을 찾으려 함',
        childVersion: '궁금한 게 생기면 스스로 알아보려고 해요',
        observableIn: ['home', 'school', 'play']
      },
      {
        id: 'INQ-COG-02',
        category: 'cognitive',
        indicator: '다양한 정보원을 활용하여 연구함',
        childVersion: '책, 인터넷, 사람들에게 물어서 알아봐요',
        observableIn: ['school', 'home']
      },
      {
        id: 'INQ-BEH-01',
        category: 'behavioral',
        indicator: '새로운 것을 배울 때 집중력을 보임',
        childVersion: '새로운 걸 배울 때 정말 열심히 집중해요',
        observableIn: ['school', 'home', 'play']
      },
      {
        id: 'INQ-EMO-01',
        category: 'emotional',
        indicator: '탐구 과정에서 즐거움을 표현함',
        childVersion: '알아가는 게 재미있어요!',
        observableIn: ['home', 'school', 'play']
      }
    ],
    observationRubrics: [
      {
        level: 'expert',
        levelKo: '숙련',
        description: '복잡한 질문을 스스로 생성하고 체계적으로 탐구하며, 독립적인 연구 프로젝트를 수행함',
        childDescription: '스스로 주제를 정하고 계획을 세워 탐구해요',
        examples: [
          '자신만의 연구 질문을 만들어 장기 프로젝트 수행',
          '다양한 정보원을 비교 분석하여 결론 도출',
          '탐구 결과를 체계적으로 정리하여 발표'
        ]
      },
      {
        level: 'proficient',
        levelKo: '능숙',
        description: '주어진 주제에 대해 깊이 있는 질문을 하고, 안내된 탐구 활동에 적극 참여함',
        childDescription: '선생님이 알려준 주제에서 더 알고 싶은 걸 찾아요',
        examples: [
          '수업 내용에서 심화 질문 생성',
          '주어진 자료를 활용한 탐구 활동 완수',
          '탐구 결과를 또래와 공유'
        ]
      },
      {
        level: 'novice',
        levelKo: '초보',
        description: '기본적인 호기심을 보이나 탐구 활동은 제한적이며, 답을 기다리는 경향이 있음',
        childDescription: '궁금한 건 있지만 누가 알려줄 때까지 기다려요',
        examples: [
          '간단한 질문은 하지만 직접 찾아보지 않음',
          '탐구 활동에 수동적 참여',
          '정해진 답을 선호함'
        ]
      }
    ],
    assessmentQuestions: [
      {
        id: 'INQ-Q-01',
        type: 'observation',
        question: '아이가 새로운 것을 발견했을 때 어떻게 반응하나요?',
        childAdapted: '새로운 걸 보면 어떻게 해?',
        followUp: ['무엇에 대해 가장 궁금해하나요?', '스스로 찾아보려고 하나요?'],
        targetAge: { min: 5, max: 14 },
        forObserver: 'both'
      },
      {
        id: 'INQ-Q-02',
        type: 'situation',
        question: '프로젝트 주제를 스스로 선택할 때 어떤 과정을 거치나요?',
        childAdapted: '연구하고 싶은 주제를 어떻게 정해?',
        followUp: ['왜 그 주제를 선택했나요?', '어떻게 알아볼 계획인가요?'],
        targetAge: { min: 8, max: 14 },
        forObserver: 'teacher'
      }
    ],
    businessCompetencies: [
      {
        competency: 'Learning Agility',
        competencyKo: '학습 민첩성',
        description: '새로운 상황에서 빠르게 학습하고 적응하는 능력',
        futureRelevance: '급변하는 업무 환경에서 필수적인 역량',
        relatedCareers: ['연구원', '컨설턴트', 'R&D 전문가']
      },
      {
        competency: 'Research & Development',
        competencyKo: '연구개발 역량',
        description: '체계적 탐구와 혁신을 이끄는 능력',
        futureRelevance: '과학기술 및 혁신 분야의 핵심 역량',
        relatedCareers: ['과학자', '개발자', '혁신 리더']
      },
      {
        competency: 'Critical Thinking',
        competencyKo: '비판적 사고',
        description: '정보를 분석하고 평가하는 능력',
        futureRelevance: '의사결정과 문제해결의 기반',
        relatedCareers: ['분석가', '전략가', '언론인']
      }
    ],
    ageAdaptations: {
      early: {
        age: '5-7',
        ageGroup: 'early',
        indicators: [
          '왜?, 어떻게? 질문을 자주 함',
          '새로운 물건을 만지고 탐색함',
          '그림책에서 궁금한 점을 물어봄'
        ],
        activities: [
          '자연 관찰 놀이',
          '간단한 과학 실험',
          '호기심 상자 탐험'
        ],
        communicationStyle: '짧고 구체적인 질문으로 호기심 자극'
      },
      middle: {
        age: '8-10',
        ageGroup: 'middle',
        indicators: [
          '스스로 정보를 찾아보려 함',
          '관심 주제에 대해 깊이 알고 싶어함',
          '실험이나 조사 활동을 즐김'
        ],
        activities: [
          '미니 연구 프로젝트',
          '과학 박람회 참여',
          '주제 탐구 발표'
        ],
        communicationStyle: '탐구 과정을 함께 계획하고 격려'
      },
      late: {
        age: '11-14',
        ageGroup: 'late',
        indicators: [
          '복잡한 주제에 대해 독립적 연구 수행',
          '여러 정보원을 비교 분석함',
          '자신만의 연구 질문을 생성함'
        ],
        activities: [
          '장기 연구 프로젝트',
          '학술 대회 참가',
          '멘토와 함께하는 심화 탐구'
        ],
        communicationStyle: '동등한 탐구 파트너로서 대화'
      }
    }
  },
  {
    id: 'Thinker',
    nameKo: '생각하는 사람',
    nameEn: 'Thinkers',
    icon: '💭',
    definition: '우리는 비판적이고 창의적인 사고력을 사용하여 복잡한 문제를 분석하고 책임감 있는 행동을 합니다.',
    definitionEn: 'We use critical and creative thinking skills to analyse and take responsible action on complex problems.',
    characteristics: [
      '비판적 사고력이 뛰어남',
      '창의적으로 문제를 해결함',
      '복잡한 문제를 분석할 수 있음',
      '윤리적 결정을 내림'
    ],
    relatedCategories: ['analytical', 'creative'],
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
    },
    theoreticalBasis: {
      coreEssence: '비판적 분석과 창의적 종합을 통해 복잡한 문제를 해결하는 고차원적 인지 능력',
      psychologicalFoundation: 'Bloom의 인지적 영역 분류에서 분석, 평가, 창조의 상위 수준과 de Bono의 수평적 사고',
      developmentalImportance: '21세기 핵심역량으로 꼽히는 비판적 사고력과 창의력의 토대',
      keyResearchers: ['Benjamin Bloom', 'Edward de Bono', 'Robert Sternberg']
    },
    behavioralIndicators: [
      {
        id: 'THK-COG-01',
        category: 'cognitive',
        indicator: '문제를 여러 각도에서 분석함',
        childVersion: '문제를 여러 방향에서 생각해봐요',
        observableIn: ['school', 'home', 'play']
      },
      {
        id: 'THK-COG-02',
        category: 'cognitive',
        indicator: '창의적인 해결책을 제시함',
        childVersion: '새로운 방법을 생각해내요',
        observableIn: ['school', 'play']
      },
      {
        id: 'THK-BEH-01',
        category: 'behavioral',
        indicator: '결정하기 전에 여러 옵션을 고려함',
        childVersion: '선택하기 전에 여러 가지를 생각해봐요',
        observableIn: ['home', 'school', 'social']
      }
    ],
    observationRubrics: [
      {
        level: 'expert',
        levelKo: '숙련',
        description: '복잡한 문제를 체계적으로 분석하고, 창의적이고 실현 가능한 해결책을 독립적으로 개발함',
        childDescription: '어려운 문제도 단계별로 풀어내고 새로운 해결책을 만들어요',
        examples: [
          '다양한 관점에서 문제 분석 후 최적 해결책 도출',
          '창의적 아이디어를 실행 계획으로 발전',
          '윤리적 고려를 포함한 의사결정'
        ]
      },
      {
        level: 'proficient',
        levelKo: '능숙',
        description: '주어진 문제에 대해 여러 해결책을 생각하고, 장단점을 비교함',
        childDescription: '문제에 대해 여러 방법을 생각하고 비교해요',
        examples: [
          '2-3가지 해결책 제시 및 비교',
          '안내된 분석 프레임워크 활용',
          '결정의 결과 예측'
        ]
      },
      {
        level: 'novice',
        levelKo: '초보',
        description: '단순한 문제 해결은 가능하나, 복잡한 상황에서는 도움이 필요함',
        childDescription: '쉬운 문제는 풀 수 있지만 어려운 건 도움이 필요해요',
        examples: [
          '단순한 선택 상황에서 결정',
          '주어진 옵션 중 선택',
          '즉각적인 결과만 고려'
        ]
      }
    ],
    assessmentQuestions: [
      {
        id: 'THK-Q-01',
        type: 'situation',
        question: '예상치 못한 문제가 생겼을 때 어떻게 접근하나요?',
        childAdapted: '생각 못한 문제가 생기면 어떻게 해?',
        followUp: ['다른 방법은 없을까요?', '왜 그 방법을 선택했나요?'],
        targetAge: { min: 7, max: 14 },
        forObserver: 'both'
      }
    ],
    businessCompetencies: [
      {
        competency: 'Strategic Thinking',
        competencyKo: '전략적 사고',
        description: '장기적 관점에서 복잡한 상황을 분석하고 계획하는 능력',
        futureRelevance: '리더십과 경영의 핵심 역량',
        relatedCareers: ['전략 컨설턴트', '경영자', '정책 분석가']
      },
      {
        competency: 'Problem Solving',
        competencyKo: '문제 해결력',
        description: '복잡한 문제를 구조화하고 해결하는 능력',
        futureRelevance: '모든 분야에서 필수적인 역량',
        relatedCareers: ['엔지니어', '의사', '변호사']
      }
    ],
    ageAdaptations: {
      early: {
        age: '5-7',
        ageGroup: 'early',
        indicators: [
          '간단한 퍼즐을 즐김',
          '"만약~라면" 질문을 함',
          '놀이에서 규칙을 변형함'
        ],
        activities: [
          '블록 쌓기 도전',
          '간단한 미로 찾기',
          '이야기 결말 바꾸기'
        ],
        communicationStyle: '구체적인 예시와 함께 생각 과정 안내'
      },
      middle: {
        age: '8-10',
        ageGroup: 'middle',
        indicators: [
          '논리적으로 주장을 펼침',
          '여러 해결책을 비교함',
          '가설을 세우고 검증함'
        ],
        activities: [
          '전략 보드게임',
          '간단한 디베이트',
          '발명 아이디어 발표'
        ],
        communicationStyle: '질문을 통해 사고 과정 확장'
      },
      late: {
        age: '11-14',
        ageGroup: 'late',
        indicators: [
          '복잡한 논증을 구성함',
          '윤리적 측면을 고려함',
          '창의적 문제해결을 시도함'
        ],
        activities: [
          '철학 토론',
          '사회 문제 해결 프로젝트',
          '창업 아이디어 개발'
        ],
        communicationStyle: '성인과 동등한 수준의 토론'
      }
    }
  },
  {
    id: 'Caring',
    nameKo: '배려하는 사람',
    nameEn: 'Caring',
    icon: '❤️',
    definition: '우리는 공감, 연민, 존중을 보여줍니다. 봉사에 대한 헌신이 있으며, 다른 사람들의 삶에 긍정적인 변화를 만들기 위해 행동합니다.',
    definitionEn: 'We show empathy, compassion and respect. We have a commitment to service, and we act to make a positive difference.',
    characteristics: [
      '공감 능력이 뛰어남',
      '다른 사람을 돕고 싶어함',
      '봉사 정신이 있음',
      '주변에 긍정적 영향을 줌'
    ],
    relatedCategories: ['caring', 'leadership'],
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
    },
    theoreticalBasis: {
      coreEssence: '타인의 감정과 상황에 대한 깊은 이해와 이를 바탕으로 한 친사회적 행동',
      psychologicalFoundation: 'Martin Hoffman의 공감 발달 이론과 Daniel Goleman의 감성지능 개념',
      developmentalImportance: '건강한 관계 형성과 사회적 책임감의 기초, 정서적 웰빙의 핵심',
      keyResearchers: ['Martin Hoffman', 'Daniel Goleman', 'Carol Gilligan']
    },
    behavioralIndicators: [
      {
        id: 'CAR-EMO-01',
        category: 'emotional',
        indicator: '타인의 감정을 인식하고 반응함',
        childVersion: '친구가 슬프면 나도 마음이 아파요',
        observableIn: ['school', 'home', 'social']
      },
      {
        id: 'CAR-SOC-01',
        category: 'social',
        indicator: '도움이 필요한 사람을 적극적으로 도움',
        childVersion: '누가 힘들면 도와주고 싶어요',
        observableIn: ['school', 'home', 'social', 'play']
      },
      {
        id: 'CAR-BEH-01',
        category: 'behavioral',
        indicator: '공동체를 위해 봉사함',
        childVersion: '우리 반이나 동네를 위해 일해요',
        observableIn: ['school', 'social']
      }
    ],
    observationRubrics: [
      {
        level: 'expert',
        levelKo: '숙련',
        description: '타인의 감정과 필요를 깊이 이해하고, 주도적으로 도움을 제공하며, 지속적인 봉사 활동에 참여함',
        childDescription: '다른 사람의 마음을 잘 알고, 먼저 나서서 도와요',
        examples: [
          '친구의 복잡한 감정 상태를 정확히 파악',
          '도움이 필요한 상황을 스스로 발견하고 행동',
          '정기적인 봉사 활동 참여'
        ]
      },
      {
        level: 'proficient',
        levelKo: '능숙',
        description: '타인의 기본적인 감정을 인식하고, 도움 요청에 적극적으로 반응함',
        childDescription: '친구가 슬프거나 힘들면 위로해주고 도와줘요',
        examples: [
          '친구의 슬픔이나 기쁨에 적절히 반응',
          '도움 요청에 기꺼이 응함',
          '간헐적 봉사 활동 참여'
        ]
      },
      {
        level: 'novice',
        levelKo: '초보',
        description: '타인의 명확한 감정 표현에만 반응하고, 도움은 지시가 있을 때 제공함',
        childDescription: '누가 울면 걱정되지만 어떻게 해야 할지 잘 몰라요',
        examples: [
          '울음 등 명확한 신호에만 반응',
          '어른의 지시로 도움 제공',
          '자신의 감정 표현에 집중'
        ]
      }
    ],
    assessmentQuestions: [
      {
        id: 'CAR-Q-01',
        type: 'situation',
        question: '친구가 슬퍼 보일 때 어떻게 하나요?',
        childAdapted: '친구가 울고 있으면 어떻게 해?',
        followUp: ['왜 그렇게 하나요?', '친구가 어떻게 느낄 것 같아요?'],
        targetAge: { min: 5, max: 14 },
        forObserver: 'both'
      }
    ],
    businessCompetencies: [
      {
        competency: 'Emotional Intelligence',
        competencyKo: '감성지능',
        description: '자신과 타인의 감정을 이해하고 관리하는 능력',
        futureRelevance: '리더십과 팀워크의 핵심 요소',
        relatedCareers: ['상담사', '인사담당자', '의료인', '교육자']
      },
      {
        competency: 'Service Orientation',
        competencyKo: '서비스 지향성',
        description: '타인의 필요를 파악하고 충족시키려는 성향',
        futureRelevance: '고객 중심 비즈니스의 핵심',
        relatedCareers: ['사회복지사', '의료인', '서비스 디자이너']
      }
    ],
    ageAdaptations: {
      early: {
        age: '5-7',
        ageGroup: 'early',
        indicators: [
          '친구가 울면 걱정하는 표정을 보임',
          '장난감을 나눠 쓰려고 함',
          '아픈 사람에게 관심을 보임'
        ],
        activities: [
          '감정 카드 놀이',
          '동물 돌보기',
          '간단한 나눔 활동'
        ],
        communicationStyle: '감정 표현을 언어화해주기'
      },
      middle: {
        age: '8-10',
        ageGroup: 'middle',
        indicators: [
          '친구의 감정을 말로 표현함',
          '도움이 필요한 친구를 챙김',
          '공정함에 민감함'
        ],
        activities: [
          '또래 멘토링',
          '학급 봉사 프로젝트',
          '감정 일기 쓰기'
        ],
        communicationStyle: '공감 표현을 구체적으로 칭찬'
      },
      late: {
        age: '11-14',
        ageGroup: 'late',
        indicators: [
          '사회 문제에 관심을 보임',
          '자발적 봉사 활동 참여',
          '다양성을 존중함'
        ],
        activities: [
          '지역사회 봉사',
          '사회 이슈 토론',
          '캠페인 활동'
        ],
        communicationStyle: '사회적 책임에 대한 대화'
      }
    }
  },
  {
    id: 'Risk-taker',
    nameKo: '도전하는 사람',
    nameEn: 'Risk-takers',
    icon: '🚀',
    definition: '우리는 불확실성에 용기와 신중함을 가지고 접근합니다. 새로운 아이디어와 혁신적인 전략을 탐구합니다.',
    definitionEn: 'We approach uncertainty with forethought and determination; we work independently and cooperatively to explore new ideas and innovative strategies.',
    characteristics: [
      '새로운 도전을 두려워하지 않음',
      '혁신적인 아이디어를 탐구함',
      '회복력이 강함',
      '불확실성을 용기 있게 대면함'
    ],
    relatedCategories: ['leadership', 'practical', 'creative'],
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
    },
    theoreticalBasis: {
      coreEssence: '불확실성에 대한 건강한 태도와 실패를 성장의 기회로 삼는 회복탄력성',
      psychologicalFoundation: 'Carol Dweck의 성장 마인드셋 이론과 Angela Duckworth의 그릿(GRIT) 개념',
      developmentalImportance: '기업가 정신과 혁신 능력의 토대, 변화하는 세상에서의 적응력',
      keyResearchers: ['Carol Dweck', 'Angela Duckworth', 'Albert Bandura']
    },
    behavioralIndicators: [
      {
        id: 'RSK-BEH-01',
        category: 'behavioral',
        indicator: '새로운 활동이나 경험을 시도함',
        childVersion: '해본 적 없는 것도 해보고 싶어요',
        observableIn: ['school', 'home', 'play', 'social']
      },
      {
        id: 'RSK-EMO-01',
        category: 'emotional',
        indicator: '실패 후 다시 도전함',
        childVersion: '안 돼도 다시 해볼래요',
        observableIn: ['school', 'home', 'play']
      },
      {
        id: 'RSK-COG-01',
        category: 'cognitive',
        indicator: '위험과 보상을 평가함',
        childVersion: '해보면 좋은 점과 안 좋은 점을 생각해요',
        observableIn: ['home', 'school']
      }
    ],
    observationRubrics: [
      {
        level: 'expert',
        levelKo: '숙련',
        description: '계산된 위험을 감수하며, 실패에서 교훈을 얻고, 다른 사람들도 도전하도록 영감을 줌',
        childDescription: '새로운 것에 용감하게 도전하고, 실패해도 다시 일어나요',
        examples: [
          '새로운 프로젝트를 주도적으로 시작',
          '실패 경험을 분석하여 개선',
          '다른 친구들에게 도전 정신 전파'
        ]
      },
      {
        level: 'proficient',
        levelKo: '능숙',
        description: '새로운 경험에 열려 있고, 실패 후 회복하며, 적당한 위험을 감수함',
        childDescription: '새로운 걸 시도하고, 실패해도 다시 해봐요',
        examples: [
          '권유받은 새로운 활동에 참여',
          '실패 후 재시도',
          '약간의 불확실성 감내'
        ]
      },
      {
        level: 'novice',
        levelKo: '초보',
        description: '익숙한 것을 선호하고, 실패에 민감하며, 새로운 시도에 격려가 필요함',
        childDescription: '새로운 건 무서워서 안 해보려고 해요',
        examples: [
          '익숙한 활동만 선택',
          '실패 후 포기 경향',
          '많은 격려 필요'
        ]
      }
    ],
    assessmentQuestions: [
      {
        id: 'RSK-Q-01',
        type: 'situation',
        question: '처음 해보는 것에 도전할 때 어떤 기분인가요?',
        childAdapted: '해본 적 없는 새로운 걸 해보자고 하면 어때?',
        followUp: ['왜 그런 기분이 드나요?', '그래도 해볼 마음이 있나요?'],
        targetAge: { min: 5, max: 14 },
        forObserver: 'both'
      }
    ],
    businessCompetencies: [
      {
        competency: 'Entrepreneurship',
        competencyKo: '기업가 정신',
        description: '새로운 기회를 포착하고 실행하는 능력',
        futureRelevance: '스타트업과 혁신의 핵심 역량',
        relatedCareers: ['창업가', '투자자', '혁신 리더']
      },
      {
        competency: 'Resilience',
        competencyKo: '회복탄력성',
        description: '어려움에서 회복하고 성장하는 능력',
        futureRelevance: '변화하는 환경에서의 생존력',
        relatedCareers: ['탐험가', '운동선수', '예술가']
      }
    ],
    ageAdaptations: {
      early: {
        age: '5-7',
        ageGroup: 'early',
        indicators: [
          '새로운 놀이를 시도함',
          '높은 곳에서 뛰어내리기 등 신체 도전',
          '실패해도 다시 해보려 함'
        ],
        activities: [
          '새로운 놀이터 탐험',
          '처음 해보는 게임',
          '작은 모험 도전'
        ],
        communicationStyle: '안전 속에서 용기 격려하기'
      },
      middle: {
        age: '8-10',
        ageGroup: 'middle',
        indicators: [
          '어려운 과제에 도전함',
          '새로운 친구 사귀기를 시도함',
          '실패 경험을 이야기함'
        ],
        activities: [
          '캠핑, 등산 등 야외 도전',
          '새로운 스포츠 배우기',
          '아이디어 대회 참가'
        ],
        communicationStyle: '도전 과정과 배움을 칭찬'
      },
      late: {
        age: '11-14',
        ageGroup: 'late',
        indicators: [
          '어려운 목표를 설정함',
          '리스크를 분석함',
          '실패에서 교훈을 찾음'
        ],
        activities: [
          '창업 프로젝트',
          '도전적인 대회 참가',
          '리더십 역할 맡기'
        ],
        communicationStyle: '전략적 위험 관리 논의'
      }
    }
  }
];

// 나머지 6개 프로필도 동일한 구조로 추가 (Knowledgeable, Communicator, Principled, Open-minded, Balanced, Reflective)
// 간결성을 위해 기본 정보만 포함한 템플릿 제공

export const REMAINING_PROFILES_TEMPLATE: Partial<EnhancedIBProfile>[] = [
  {
    id: 'Knowledgeable',
    nameKo: '지식이 있는 사람',
    nameEn: 'Knowledgeable',
    icon: '📚',
    relatedCategories: ['analytical', 'leadership']
  },
  {
    id: 'Communicator',
    nameKo: '소통하는 사람',
    nameEn: 'Communicators',
    icon: '💬',
    relatedCategories: ['leadership', 'caring']
  },
  {
    id: 'Principled',
    nameKo: '원칙을 지키는 사람',
    nameEn: 'Principled',
    icon: '⚖️',
    relatedCategories: ['leadership', 'caring']
  },
  {
    id: 'Open-minded',
    nameKo: '열린 마음을 가진 사람',
    nameEn: 'Open-minded',
    icon: '🌍',
    relatedCategories: ['caring', 'creative']
  },
  {
    id: 'Balanced',
    nameKo: '균형 잡힌 사람',
    nameEn: 'Balanced',
    icon: '⚖️',
    relatedCategories: ['practical', 'caring']
  },
  {
    id: 'Reflective',
    nameKo: '성찰하는 사람',
    nameEn: 'Reflective',
    icon: '🪞',
    relatedCategories: ['analytical', 'caring']
  }
];

/**
 * ID로 강화된 IB 프로필 찾기
 */
export function getEnhancedIBProfile(profileId: string): EnhancedIBProfile | undefined {
  return ENHANCED_IB_PROFILES.find(p => p.id === profileId);
}

/**
 * 연령에 맞는 적응 콘텐츠 가져오기
 */
export function getAgeAdaptedContent(profileId: string, age: number) {
  const profile = getEnhancedIBProfile(profileId);
  if (!profile) return null;

  if (age >= 5 && age <= 7) return profile.ageAdaptations.early;
  if (age >= 8 && age <= 10) return profile.ageAdaptations.middle;
  if (age >= 11 && age <= 14) return profile.ageAdaptations.late;

  return profile.ageAdaptations.middle; // 기본값
}
