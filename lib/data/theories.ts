import { CareerCategory } from '@/lib/types/assessment';

// 이론적 근거 데이터베이스

// Holland RIASEC 직업흥미이론 (출처: 커리어넷, 워크넷)
export interface HollandType {
  code: string;
  nameEn: string;
  nameKo: string;
  description: string;
  characteristics: string[];
  preferredActivities: string[];
  careers: string[];
  relatedCategory: CareerCategory;
}

export const HOLLAND_TYPES: HollandType[] = [
  {
    code: 'R',
    nameEn: 'Realistic',
    nameKo: '현실형',
    description: '솔직하고, 성실하고, 검소하며, 신체적으로 활동적인 성격을 지니고 있습니다. 소박하고 말이 적으며 기계적인 적성이 높습니다. 명확하고 체계적이며 질서 정연한 일을 좋아하고, 전기나 기계, 공학계열 분야와 같이 실제적이고 규칙적인 행동양식이 존재하는 분야를 선호합니다.',
    characteristics: [
      '솔직하고 성실하며 검소함',
      '신체적으로 활동적임',
      '기계적 적성이 높음',
      '명확하고 체계적인 일을 선호함',
      '실용적이고 현실적임'
    ],
    preferredActivities: [
      '도구나 기계를 다루는 활동',
      '동물이나 식물을 돌보는 활동',
      '야외에서 하는 신체적 활동',
      '물건을 만들거나 수리하는 활동',
      '규칙적이고 체계적인 작업'
    ],
    careers: ['비행기조종사', '정비사', '기술자', '농부', '목수', '경찰', '운동선수', '요리사'],
    relatedCategory: 'practical'
  },
  {
    code: 'I',
    nameEn: 'Investigative',
    nameKo: '탐구형',
    description: '탐구심이 많고 논리적, 분석적, 합리적인 성격을 지니고 있습니다. 지적 호기심이 많고, 수학적, 과학적인 적성이 높습니다. 현상을 비판적이고 분석적으로 관찰하고, 체계적이고 창조적으로 탐구하는 것을 좋아하는 반면, 규칙적이고 반복적인 활동이나 리더십을 발휘해야 하는 활동은 별로 좋아하지 않습니다.',
    characteristics: [
      '탐구심이 많고 지적 호기심이 강함',
      '논리적, 분석적, 합리적임',
      '수학적, 과학적 적성이 높음',
      '비판적이고 분석적으로 관찰함',
      '독립적으로 일하는 것을 선호함'
    ],
    preferredActivities: [
      '과학적 연구 및 실험',
      '데이터 분석 및 해석',
      '복잡한 문제 해결',
      '체계적이고 창조적인 탐구',
      '독서 및 학습'
    ],
    careers: ['수학자', '과학자', '물리학자', '의학자', '치과의사', '약사', '심리학자', '의학연구원', '프로그래머', '데이터분석가'],
    relatedCategory: 'analytical'
  },
  {
    code: 'A',
    nameEn: 'Artistic',
    nameKo: '예술형',
    description: '상상력과 감수성이 풍부하며, 자유분방하고 개방적인 성격을 지니고 있습니다. 예술에 소질이 있고, 창의적인 것을 창출해 내는 재능이 있습니다. 창의적이고 유연한 사고를 즐겨하며 아름다움을 추구하는 경향이 강합니다. 틀에 박힌 일이나 같은 패턴의 일을 별로 좋아하지 않으며, 상상력이 풍부하고 독창적입니다.',
    characteristics: [
      '상상력과 감수성이 풍부함',
      '자유분방하고 개방적임',
      '창의적인 것을 창출하는 재능',
      '유연한 사고를 즐김',
      '아름다움을 추구함',
      '독창적이고 틀에 박힌 일을 싫어함'
    ],
    preferredActivities: [
      '예술 작품 창작',
      '음악, 연극, 글쓰기',
      '디자인 및 시각 예술',
      '창의적 문제 해결',
      '자유로운 표현 활동'
    ],
    careers: ['미술가', '음악가', '건축기사', '사진작가', '광고디자이너', '극작가', '애니메이터', '무용가', '작가'],
    relatedCategory: 'creative'
  },
  {
    code: 'S',
    nameEn: 'Social',
    nameKo: '사회형',
    description: '다른 사람에게 친절하고 이해심이 많으며, 남을 도와주려는 경향이 높고, 봉사하고자 하는 마음이 큽니다. 대인관계 능력이 좋고 사람들을 좋아하는 성향을 지니고 있습니다. 타인의 문제를 듣고 공감하고, 도와주고, 치료해주는 것을 선호하며 사람을 상대하는 활동에 능숙합니다.',
    characteristics: [
      '친절하고 이해심이 많음',
      '남을 도와주려는 경향이 높음',
      '봉사하고자 하는 마음이 큼',
      '대인관계 능력이 좋음',
      '공감 능력이 뛰어남',
      '사람을 상대하는 활동에 능숙함'
    ],
    preferredActivities: [
      '사람들을 가르치는 활동',
      '상담 및 조언',
      '봉사 활동',
      '팀워크가 필요한 활동',
      '타인을 돌보고 치료하는 활동'
    ],
    careers: ['교사', '상담가', '간호사', '물리치료사', '보육교사', '사회복지사', '유치원교사'],
    relatedCategory: 'caring'
  },
  {
    code: 'E',
    nameEn: 'Enterprising',
    nameKo: '진취형',
    description: '지도력과 설득력을 가지고 있고, 열성적이고 경쟁적이며 이성적인 성향이 강합니다. 외향적이고 통솔력을 지니고 있으며, 언어와 관련된 적성이 높습니다. 자신이 기획하고 목표 설정한 것을 실행시키는 데 탁월한 능력을 보이며, 개인과 조직의 목표를 달성하거나 경제적인 이익을 추구하기 위한 활동을 선호합니다.',
    characteristics: [
      '지도력과 설득력이 있음',
      '열성적이고 경쟁적임',
      '외향적이고 통솔력이 있음',
      '언어 관련 적성이 높음',
      '목표 지향적이고 실행력이 강함',
      '경제적 이익 추구를 좋아함'
    ],
    preferredActivities: [
      '프로젝트 기획 및 관리',
      '사람들을 설득하는 활동',
      '사업 운영',
      '판매 및 마케팅',
      '목표 설정 및 실행'
    ],
    careers: ['정치가', '경영자', '영업직', '변호사', '마케팅이사', '부동산중개인', '판매관리자'],
    relatedCategory: 'leadership'
  },
  {
    code: 'C',
    nameEn: 'Conventional',
    nameKo: '관습형',
    description: '책임감이 강하고 빈틈이 없으며, 행동을 할 때 조심스러운 면을 보입니다. 조직적이고 체계적이며 규칙과 시스템이 잡혀 있는 일을 좋아하고, 수립되어 있는 시스템에 적응하여 규칙에 맞게 성실하고 체계적으로 일을 하는 것을 좋아하여, 서류 작성 및 기록 등과 같은 사무적인 일에 능력을 발휘합니다.',
    characteristics: [
      '책임감이 강하고 빈틈이 없음',
      '조심스럽고 신중함',
      '체계적이고 조직적임',
      '규칙과 시스템을 잘 따름',
      '성실하게 일을 수행함',
      '사무적인 일에 능함'
    ],
    preferredActivities: [
      '데이터 정리 및 관리',
      '문서 작성 및 기록',
      '계획 수립 및 스케줄 관리',
      '수치 계산',
      '서류 작성 및 정리'
    ],
    careers: ['회계사', '행정보조', '은행원', '세무사', '컴퓨터프로그래머', '재무분석가'],
    relatedCategory: 'analytical'
  }
];

// Gardner 다중지능 이론
export interface MultipleIntelligence {
  id: string;
  nameEn: string;
  nameKo: string;
  description: string;
  characteristics: string[];
  relatedCategories: CareerCategory[];
}

export const GARDNER_INTELLIGENCES: MultipleIntelligence[] = [
  {
    id: 'linguistic',
    nameEn: 'Linguistic Intelligence',
    nameKo: '언어지능',
    description: '말과 글로 효과적으로 표현하고 이해하는 능력',
    characteristics: ['글쓰기를 잘함', '언어 학습이 빠름', '읽기를 좋아함'],
    relatedCategories: ['creative', 'leadership']
  },
  {
    id: 'logical',
    nameEn: 'Logical-Mathematical Intelligence',
    nameKo: '논리수학지능',
    description: '숫자를 효과적으로 사용하고 논리적으로 추론하는 능력',
    characteristics: ['수학 문제를 잘 풀음', '패턴을 잘 찾음', '논리적 사고'],
    relatedCategories: ['analytical']
  },
  {
    id: 'spatial',
    nameEn: 'Spatial Intelligence',
    nameKo: '공간지능',
    description: '시각적, 공간적 세계를 정확하게 인지하고 표현하는 능력',
    characteristics: ['그림을 잘 그림', '방향 감각이 좋음', '시각화 능력'],
    relatedCategories: ['creative', 'practical']
  },
  {
    id: 'bodily',
    nameEn: 'Bodily-Kinesthetic Intelligence',
    nameKo: '신체운동지능',
    description: '몸 전체나 일부를 사용해 아이디어와 감정을 표현하는 능력',
    characteristics: ['운동을 잘함', '손재주가 좋음', '신체 활동을 좋아함'],
    relatedCategories: ['practical']
  },
  {
    id: 'musical',
    nameEn: 'Musical Intelligence',
    nameKo: '음악지능',
    description: '음악적 형태를 지각하고, 구별하고, 표현하는 능력',
    characteristics: ['음악을 잘 이해함', '리듬감이 좋음', '악기 연주'],
    relatedCategories: ['creative']
  },
  {
    id: 'interpersonal',
    nameEn: 'Interpersonal Intelligence',
    nameKo: '대인관계지능',
    description: '다른 사람의 기분, 동기, 욕구를 이해하고 반응하는 능력',
    characteristics: ['사람들과 잘 어울림', '타인을 잘 이해함', '협동 능력'],
    relatedCategories: ['caring', 'leadership']
  },
  {
    id: 'intrapersonal',
    nameEn: 'Intrapersonal Intelligence',
    nameKo: '자기이해지능',
    description: '자기 자신을 이해하고 그에 따라 행동하는 능력',
    characteristics: ['자기 성찰을 잘함', '독립적', '목표 지향적'],
    relatedCategories: ['analytical', 'creative']
  },
  {
    id: 'naturalist',
    nameEn: 'Naturalist Intelligence',
    nameKo: '자연탐구지능',
    description: '자연 환경의 다양한 종을 인식하고 분류하는 능력',
    characteristics: ['자연을 좋아함', '분류를 잘함', '관찰력이 좋음'],
    relatedCategories: ['analytical', 'practical']
  }
];

// 이론 출처 정보
export const THEORY_SOURCES = {
  holland: {
    name: 'Holland 직업흥미이론 (RIASEC)',
    author: 'John L. Holland',
    year: 1959,
    description: '개인의 성격 유형과 직업 환경의 일치도를 기반으로 한 진로 선택 이론',
    koreanSources: [
      {
        name: '커리어넷 직업흥미검사',
        organization: '한국직업능력개발원',
        url: 'https://www.career.go.kr'
      },
      {
        name: '워크넷 직업선호도검사',
        organization: '한국고용정보원',
        url: 'https://www.work.go.kr'
      }
    ]
  },
  gardner: {
    name: 'Gardner 다중지능이론',
    author: 'Howard Gardner',
    year: 1983,
    description: '인간의 지능이 단일하지 않고 여러 가지 독립적인 지능으로 구성되어 있다는 이론',
    koreanSources: [
      {
        name: '한국교육개발원',
        organization: 'KEDI',
        url: 'https://www.kedi.re.kr'
      }
    ]
  },
  super: {
    name: 'Super 진로발달이론',
    author: 'Donald E. Super',
    year: 1953,
    description: '진로 발달이 전 생애에 걸쳐 일어나는 연속적인 과정이라는 이론',
    koreanSources: [
      {
        name: '한국청소년상담복지개발원',
        organization: 'KYCI',
        url: 'https://www.kyci.or.kr'
      }
    ]
  }
};

// 직업군과 Holland 코드 매핑
export const CATEGORY_TO_HOLLAND: Record<CareerCategory, string[]> = {
  creative: ['A', 'I'],     // 예술형, 탐구형
  analytical: ['I', 'C'],   // 탐구형, 관습형
  caring: ['S'],            // 사회형
  leadership: ['E', 'S'],   // 진취형, 사회형
  practical: ['R']          // 현실형
};

// 직업군과 다중지능 매핑
export const CATEGORY_TO_INTELLIGENCE: Record<CareerCategory, string[]> = {
  creative: ['spatial', 'musical', 'linguistic'],
  analytical: ['logical', 'naturalist', 'intrapersonal'],
  caring: ['interpersonal', 'linguistic'],
  leadership: ['interpersonal', 'linguistic', 'intrapersonal'],
  practical: ['bodily', 'spatial', 'naturalist']
};

// Holland 유형 정보 가져오기
export function getHollandType(code: string): HollandType | undefined {
  return HOLLAND_TYPES.find(t => t.code === code);
}

// 직업군에 해당하는 Holland 유형 가져오기
export function getHollandTypesForCategory(category: CareerCategory): HollandType[] {
  const codes = CATEGORY_TO_HOLLAND[category];
  return HOLLAND_TYPES.filter(t => codes.includes(t.code));
}
