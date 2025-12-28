# IB 학습자상 통합 워크플로우

> PDF "IB 학습자상 상세 분석 및 판별 가이드"와 기존 PERSONALIZATION_PLAN.md를 통합한 개선 계획

## 1. 갭 분석 결과

### 현재 구현 상태
| 항목 | 현재 상태 | PDF 기준 개선 필요 |
|------|----------|-------------------|
| IB 프로필 정의 | ✅ 기본 정의 있음 | 이론적 심층 분석 추가 |
| 행동 지표 | ❌ 없음 | PDF의 상세 지표 적용 |
| 관찰 척도 | ❌ 없음 | 3단계 루브릭 추가 |
| 평가 질문 | ⚠️ ibWeights만 있음 | STAR 기반 질문 추가 |
| 비즈니스 역량 연계 | ❌ 없음 | PDF 역량 매핑 적용 |
| 부모/교사 가이드 | ✅ 기본 있음 | 관찰 가이드 강화 |

### 핵심 개선 영역
1. **행동 지표 체계화**: 각 IB 프로필별 관찰 가능한 행동 지표 추가
2. **3단계 관찰 척도**: 숙련/능숙/초보 수준별 평가 기준
3. **아동 적응형 평가**: 성인용 평가 방법론을 5-14세에 맞게 변환
4. **통합 평가 프로세스**: 관찰 → 탐색(질문) → 검증 3단계

---

## 2. 향상된 IB 프로필 데이터 구조

### 2.1 확장된 인터페이스 설계

```typescript
// lib/types/ib-enhanced.ts

export interface BehavioralIndicator {
  id: string;
  category: 'cognitive' | 'emotional' | 'social' | 'behavioral';
  indicator: string;
  childVersion: string;  // 아동용 표현
  observableIn: ('home' | 'school' | 'play' | 'social')[];
}

export interface ObservationRubric {
  level: 'expert' | 'proficient' | 'novice';
  levelKo: '숙련' | '능숙' | '초보';
  description: string;
  childDescription: string;  // 아동 맥락 설명
  examples: string[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'observation' | 'interview' | 'situation';
  question: string;
  childAdapted: string;  // 아동용 질문
  followUp: string[];
  targetAge: { min: number; max: number };
  forObserver: 'parent' | 'teacher' | 'both';
}

export interface BusinessCompetency {
  competency: string;
  competencyKo: string;
  description: string;
  futureRelevance: string;  // 미래 진로 연관성
}

export interface EnhancedIBProfile {
  id: IBProfile;
  nameKo: string;
  nameEn: string;

  // 기존 필드 (유지)
  definition: string;
  characteristics: string[];
  educationMethods: {
    parentGuide: string[];
    teacherGuide: string[];
    activities: string[];
    avoidBehaviors: string[];
  };

  // 신규 필드 (PDF 기반)
  theoreticalBasis: {
    coreEssence: string;
    psychologicalFoundation: string;
    developmentalImportance: string;
  };

  behavioralIndicators: BehavioralIndicator[];
  observationRubrics: ObservationRubric[];
  assessmentQuestions: AssessmentQuestion[];
  businessCompetencies: BusinessCompetency[];

  // 아동 발달 단계별 표현
  ageAdaptations: {
    early: { age: '5-7', indicators: string[], activities: string[] };
    middle: { age: '8-10', indicators: string[], activities: string[] };
    late: { age: '11-14', indicators: string[], activities: string[] };
  };
}
```

### 2.2 예시: Inquirer (탐구하는 사람) 확장 데이터

```typescript
const INQUIRER_ENHANCED: EnhancedIBProfile = {
  id: 'Inquirer',
  nameKo: '탐구하는 사람',
  nameEn: 'Inquirer',

  definition: '호기심을 바탕으로 탐구와 연구에 필요한 기술을 기르고...',
  characteristics: ['강한 호기심', '질문하기 좋아함', '독립적 학습'],

  theoreticalBasis: {
    coreEssence: '지적 호기심과 자기주도적 학습 능력의 결합',
    psychologicalFoundation: '내재적 동기와 성장 마인드셋에 기반',
    developmentalImportance: '평생학습의 기초가 되는 핵심 역량'
  },

  behavioralIndicators: [
    {
      id: 'INQ-01',
      category: 'cognitive',
      indicator: '새로운 정보를 접했을 때 추가 질문을 생성한다',
      childVersion: '새로운 것을 보면 "왜?", "어떻게?" 질문을 많이 해요',
      observableIn: ['home', 'school']
    },
    {
      id: 'INQ-02',
      category: 'behavioral',
      indicator: '독립적으로 정보를 찾고 검증하려 한다',
      childVersion: '궁금한 게 있으면 스스로 책이나 인터넷에서 찾아봐요',
      observableIn: ['home', 'school']
    },
    {
      id: 'INQ-03',
      category: 'emotional',
      indicator: '학습 과정 자체에서 즐거움을 느낀다',
      childVersion: '새로운 걸 배울 때 신나고 재미있어해요',
      observableIn: ['school', 'play']
    }
  ],

  observationRubrics: [
    {
      level: 'expert',
      levelKo: '숙련',
      description: '복잡한 질문을 스스로 생성하고 체계적으로 탐구한다',
      childDescription: '어려운 주제도 스스로 파고들어 알아내요',
      examples: [
        '프로젝트 주제를 스스로 정하고 계획을 세움',
        '여러 출처의 정보를 비교하며 탐구함'
      ]
    },
    {
      level: 'proficient',
      levelKo: '능숙',
      description: '주어진 주제에 대해 깊이 있는 질문을 한다',
      childDescription: '선생님이 알려준 내용에 추가 질문을 잘 해요',
      examples: [
        '수업 내용에서 더 알고 싶은 것을 질문함',
        '책을 읽고 관련 정보를 더 찾아봄'
      ]
    },
    {
      level: 'novice',
      levelKo: '초보',
      description: '기본적인 호기심을 보이나 탐구는 제한적이다',
      childDescription: '가끔 궁금해하지만 깊이 찾아보진 않아요',
      examples: [
        '질문은 하지만 답을 기다림',
        '관심은 있으나 스스로 찾아보진 않음'
      ]
    }
  ],

  assessmentQuestions: [
    {
      id: 'INQ-Q01',
      type: 'observation',
      question: '새로운 주제를 접했을 때 어떤 반응을 보이는가?',
      childAdapted: '새로운 것을 알게 되면 어떻게 해요?',
      followUp: ['어떤 질문을 했나요?', '더 알아보고 싶었나요?'],
      targetAge: { min: 5, max: 14 },
      forObserver: 'both'
    },
    {
      id: 'INQ-Q02',
      type: 'interview',
      question: '최근 스스로 찾아본 것이 있다면 무엇인가요?',
      childAdapted: '요즘 궁금해서 찾아본 게 있어요?',
      followUp: ['왜 궁금했어요?', '어떻게 찾아봤어요?'],
      targetAge: { min: 7, max: 14 },
      forObserver: 'both'
    }
  ],

  businessCompetencies: [
    {
      competency: 'Learning Agility',
      competencyKo: '학습 민첩성',
      description: '새로운 환경과 도전에 빠르게 적응하는 능력',
      futureRelevance: '빠르게 변화하는 직업 환경에서 핵심 역량'
    },
    {
      competency: 'Research & Development',
      competencyKo: '연구개발 역량',
      description: '체계적인 탐구와 혁신을 주도하는 능력',
      futureRelevance: '과학자, 연구원, 혁신가 등의 진로와 연결'
    }
  ],

  ageAdaptations: {
    early: {
      age: '5-7',
      indicators: [
        '"왜요?" 질문을 자주 함',
        '새로운 장난감이나 물건을 탐색함',
        '그림책에서 궁금한 것을 물어봄'
      ],
      activities: [
        '자연 관찰 놀이',
        '간단한 실험 활동',
        '"왜?" 질문 격려하기'
      ]
    },
    middle: {
      age: '8-10',
      indicators: [
        '관심 주제에 대해 깊이 파고듦',
        '도서관이나 인터넷에서 정보를 찾음',
        '실험이나 프로젝트를 즐김'
      ],
      activities: [
        '주제 탐구 프로젝트',
        '과학 실험 키트',
        '다큐멘터리 시청 후 토론'
      ]
    },
    late: {
      age: '11-14',
      indicators: [
        '독립적으로 연구 주제를 선정함',
        '여러 출처의 정보를 비교 분석함',
        '자신만의 탐구 방법을 개발함'
      ],
      activities: [
        '자유 탐구 보고서 작성',
        '온라인 강좌 수강',
        '멘토와 함께하는 심화 프로젝트'
      ]
    }
  },

  educationMethods: {
    parentGuide: [
      '아이의 질문에 함께 답을 찾아가세요',
      '다양한 체험 기회를 제공하세요',
      '"왜?"라는 질문을 격려하세요'
    ],
    teacherGuide: [
      '탐구 기반 학습 활동을 설계하세요',
      '열린 질문으로 사고를 자극하세요',
      '자기주도적 프로젝트를 지원하세요'
    ],
    activities: [
      '과학 탐구 활동',
      '독서 후 토론',
      '현장 학습 및 체험'
    ],
    avoidBehaviors: [
      '질문을 귀찮아하거나 무시하기',
      '정해진 답만 강요하기',
      '호기심을 억누르기'
    ]
  }
};
```

---

## 3. 통합 평가 프로세스 설계

### 3.1 3단계 평가 프로세스

```
┌─────────────────────────────────────────────────────────────┐
│                    통합 평가 프로세스                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1단계: 관찰 (Observation)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 부모/교사 관찰 체크리스트                            │   │
│  │ • 행동 지표 기반 빈도 체크                            │   │
│  │ • 일상 상황에서의 자연스러운 관찰                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  2단계: 탐색 (Inquiry) - 선택적                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • 상황 기반 질문 (아동용 적응)                         │   │
│  │ • 아이의 생각/선호도 직접 수집                         │   │
│  │ • 부모-아이 함께하는 활동 관찰                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  3단계: 검증 (Verification)                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • AI 분석 결과와 관찰 데이터 교차 검증                  │   │
│  │ • 이전 검사 결과와 비교                               │   │
│  │ • 발달 단계 고려한 해석                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 평가 모드별 프로세스

#### A. 간소화 모드 (Quick Mode)
```
관찰 체크리스트 (10문항) → AI 분석 → 결과
- 소요 시간: 5-10분
- 대상: 빠른 스크리닝, 반복 검사
```

#### B. 표준 모드 (Standard Mode)
```
관찰 체크리스트 → 성향 검사 (24문항) → AI 분석 → 결과
- 소요 시간: 15-20분
- 대상: 일반적인 성향 파악
```

#### C. 심화 모드 (Comprehensive Mode)
```
관찰 체크리스트 → 성향 검사 → 상황 질문 →
부모/아이 활동 → AI 심층 분석 → 상세 결과 + 발달 가이드
- 소요 시간: 30-45분
- 대상: 심층 분석, 진로 상담 준비
```

---

## 4. 향상된 질문 체계

### 4.1 관찰 체크리스트 (부모/교사용)

```typescript
// lib/data/observation-checklist.ts

export interface ObservationItem {
  id: string;
  profileTarget: IBProfile[];
  question: string;
  frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  context: 'home' | 'school' | 'both';
  ageRange: { min: number; max: number };
}

export const OBSERVATION_CHECKLIST: ObservationItem[] = [
  // Inquirer 관련
  {
    id: 'OBS-INQ-01',
    profileTarget: ['Inquirer'],
    question: '새로운 것을 보면 "왜?", "어떻게?" 등의 질문을 자주 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },
  {
    id: 'OBS-INQ-02',
    profileTarget: ['Inquirer', 'Knowledgeable'],
    question: '궁금한 것이 있으면 책이나 인터넷에서 스스로 찾아봅니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 7, max: 14 }
  },

  // Thinker 관련
  {
    id: 'OBS-THK-01',
    profileTarget: ['Thinker'],
    question: '문제가 생기면 여러 방법을 생각해보고 해결하려 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },
  {
    id: 'OBS-THK-02',
    profileTarget: ['Thinker', 'Reflective'],
    question: '결정을 내리기 전에 장단점을 따져봅니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 8, max: 14 }
  },

  // Communicator 관련
  {
    id: 'OBS-COM-01',
    profileTarget: ['Communicator'],
    question: '자신의 생각이나 느낌을 말로 잘 표현합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },
  {
    id: 'OBS-COM-02',
    profileTarget: ['Communicator', 'Open-minded'],
    question: '다른 사람의 이야기를 끝까지 잘 듣습니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },

  // Caring 관련
  {
    id: 'OBS-CAR-01',
    profileTarget: ['Caring'],
    question: '친구나 가족이 힘들어하면 위로하거나 도와주려 합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },
  {
    id: 'OBS-CAR-02',
    profileTarget: ['Caring', 'Principled'],
    question: '다른 사람을 돕는 활동에 기꺼이 참여합니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 6, max: 14 }
  },

  // Risk-taker 관련
  {
    id: 'OBS-RSK-01',
    profileTarget: ['Risk-taker'],
    question: '새로운 것을 시도하는 것을 두려워하지 않습니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },
  {
    id: 'OBS-RSK-02',
    profileTarget: ['Risk-taker', 'Balanced'],
    question: '실패해도 다시 도전하려는 모습을 보입니다',
    frequency: 'sometimes',
    context: 'both',
    ageRange: { min: 5, max: 14 }
  },

  // 추가 10개 항목으로 총 20개 체크리스트 구성
  // Principled, Open-minded, Knowledgeable, Balanced, Reflective 포함
];
```

### 4.2 아동용 상황 질문 (연령별 적응)

```typescript
// lib/data/situation-questions-enhanced.ts

export interface EnhancedSituationQuestion {
  id: string;
  ageGroup: 'early' | 'middle' | 'late';
  scenario: string;
  visualSupport?: string;  // 이미지/아이콘 경로
  options: {
    text: string;
    ibWeights: Partial<Record<IBProfile, number>>;
    careerWeights: Partial<Record<CareerCategory, number>>;
  }[];
}

export const ENHANCED_SITUATION_QUESTIONS: EnhancedSituationQuestion[] = [
  // 5-7세용
  {
    id: 'SIT-EARLY-01',
    ageGroup: 'early',
    scenario: '새 장난감을 받았어요. 뭘 제일 먼저 하고 싶어요?',
    visualSupport: '/images/situations/new-toy.png',
    options: [
      {
        text: '어떻게 움직이는지 뜯어보고 싶어요',
        ibWeights: { Inquirer: 2, Thinker: 1 },
        careerWeights: { analytical: 2, practical: 1 }
      },
      {
        text: '친구들이랑 같이 가지고 놀고 싶어요',
        ibWeights: { Communicator: 2, Caring: 1 },
        careerWeights: { caring: 2, leadership: 1 }
      },
      {
        text: '예쁘게 꾸며보고 싶어요',
        ibWeights: { 'Risk-taker': 1, 'Open-minded': 1 },
        careerWeights: { creative: 2 }
      },
      {
        text: '설명서대로 조립해보고 싶어요',
        ibWeights: { Knowledgeable: 1, Principled: 1 },
        careerWeights: { practical: 2, analytical: 1 }
      }
    ]
  },

  // 8-10세용
  {
    id: 'SIT-MIDDLE-01',
    ageGroup: 'middle',
    scenario: '학교에서 자유 주제로 발표를 하게 됐어요. 어떤 주제로 하고 싶어요?',
    options: [
      {
        text: '내가 직접 실험해본 과학 주제',
        ibWeights: { Inquirer: 2, 'Risk-taker': 1, Thinker: 1 },
        careerWeights: { analytical: 2, practical: 1 }
      },
      {
        text: '친구들을 도울 수 있는 방법',
        ibWeights: { Caring: 2, Principled: 1 },
        careerWeights: { caring: 2, leadership: 1 }
      },
      {
        text: '내가 그린 그림이나 만든 작품 소개',
        ibWeights: { 'Open-minded': 1, Communicator: 1 },
        careerWeights: { creative: 2 }
      },
      {
        text: '우리 반을 더 좋게 만드는 아이디어',
        ibWeights: { Thinker: 1, Principled: 1, 'Risk-taker': 1 },
        careerWeights: { leadership: 2, caring: 1 }
      }
    ]
  },

  // 11-14세용
  {
    id: 'SIT-LATE-01',
    ageGroup: 'late',
    scenario: '동아리를 만들 수 있다면 어떤 동아리를 만들고 싶어요?',
    options: [
      {
        text: '과학 탐구 또는 발명 동아리',
        ibWeights: { Inquirer: 2, Thinker: 2, 'Risk-taker': 1 },
        careerWeights: { analytical: 2, practical: 1 }
      },
      {
        text: '봉사 활동 또는 환경 보호 동아리',
        ibWeights: { Caring: 2, Principled: 2, 'Open-minded': 1 },
        careerWeights: { caring: 2, leadership: 1 }
      },
      {
        text: '예술, 음악, 창작 동아리',
        ibWeights: { 'Open-minded': 2, Communicator: 1, 'Risk-taker': 1 },
        careerWeights: { creative: 2 }
      },
      {
        text: '토론 또는 학생회 관련 동아리',
        ibWeights: { Communicator: 2, Thinker: 1, Principled: 1 },
        careerWeights: { leadership: 2, analytical: 1 }
      }
    ]
  }
];
```

---

## 5. 결과 페이지 개선

### 5.1 IB 프로필 결과 표시 강화

```typescript
// components/results/IBProfileResult.tsx 구조

interface IBProfileResultProps {
  profiles: IBProfile[];
  scores: Record<IBProfile, number>;
  childAge: number;
}

// 표시 내용:
// 1. 상위 2-3개 IB 프로필 (레이더 차트)
// 2. 각 프로필별:
//    - 프로필 설명 (아이 연령에 맞춘 표현)
//    - 관찰된 행동 지표 (체크리스트 기반)
//    - 숙련도 수준 (3단계 루브릭)
//    - 연계 비즈니스 역량 (미래 진로 힌트)
// 3. 발달 단계별 활동 추천
// 4. 부모/교사 가이드
```

### 5.2 진로 연계 강화

```typescript
// lib/data/career-ib-mapping.ts

export const CAREER_IB_DEEP_MAPPING = {
  creative: {
    primaryProfiles: ['Open-minded', 'Risk-taker', 'Communicator'],
    competencies: ['창의적 문제해결', '표현력', '혁신적 사고'],
    futureFields: ['디자인', '예술', '콘텐츠 창작', 'UX/UI', '마케팅']
  },
  analytical: {
    primaryProfiles: ['Inquirer', 'Thinker', 'Knowledgeable'],
    competencies: ['분석적 사고', '연구 역량', '논리적 추론'],
    futureFields: ['과학자', '연구원', '데이터 분석가', '엔지니어', '의사']
  },
  caring: {
    primaryProfiles: ['Caring', 'Communicator', 'Principled'],
    competencies: ['공감 능력', '대인관계', '윤리의식'],
    futureFields: ['교사', '상담사', '사회복지사', '의료인', 'NGO']
  },
  leadership: {
    primaryProfiles: ['Risk-taker', 'Communicator', 'Principled'],
    competencies: ['리더십', '의사결정', '비전 제시'],
    futureFields: ['경영자', '정치인', '기업가', '프로젝트 매니저']
  },
  practical: {
    primaryProfiles: ['Balanced', 'Knowledgeable', 'Risk-taker'],
    competencies: ['실행력', '기술 역량', '문제해결'],
    futureFields: ['엔지니어', '기술자', '건축가', '요리사', '장인']
  }
};
```

---

## 6. 구현 우선순위

### Phase 1: 데이터 구조 확장 (1주)
- [ ] `EnhancedIBProfile` 인터페이스 정의
- [ ] 10개 IB 프로필 확장 데이터 작성
- [ ] 행동 지표, 관찰 척도 데이터 구축

### Phase 2: 관찰 체크리스트 (1주)
- [ ] 20개 관찰 항목 구현
- [ ] 부모용/교사용 체크리스트 UI
- [ ] 빈도 기반 점수 산출 로직

### Phase 3: 상황 질문 강화 (1주)
- [ ] 연령별 상황 질문 15개씩 (총 45개)
- [ ] 시각적 지원 요소 추가
- [ ] IB-Career 통합 가중치 시스템

### Phase 4: 결과 페이지 개선 (1주)
- [ ] IB 프로필 결과 상세 표시
- [ ] 발달 단계별 활동 추천
- [ ] 진로 연계 정보 강화

### Phase 5: AI 분석 프롬프트 개선 (3일)
- [ ] 확장된 데이터 기반 프롬프트 업데이트
- [ ] 관찰 데이터 통합 분석
- [ ] 연령별 맞춤 피드백 생성

---

## 7. 기존 PERSONALIZATION_PLAN.md와의 통합 포인트

### 유지할 내용
- 부모 프로필 선택적 참여 (`participationType`)
- 8단계 구현 로드맵 (대부분 유지)
- UI/UX 설계 방향
- localStorage 기반 저장 구조

### 수정/강화할 내용
- IB 프로필 데이터 구조 확장 (이 문서 기준)
- 질문 체계 강화 (관찰 체크리스트 추가)
- 결과 표시 강화 (비즈니스 역량 연계)
- AI 프롬프트 고도화 (이론적 배경 포함)

### 새로 추가할 내용
- 행동 지표 시스템
- 3단계 관찰 척도
- 연령별 적응형 콘텐츠
- 비즈니스 역량 매핑

---

## 8. 다음 단계

1. **즉시 실행**: `lib/types/ib-enhanced.ts` 타입 정의 파일 생성
2. **데이터 작업**: 10개 IB 프로필 확장 데이터 JSON/TS 파일 작성
3. **UI 작업**: 관찰 체크리스트 컴포넌트 구현
4. **테스트**: 확장된 데이터로 AI 분석 결과 검증
