/**
 * 진로-IB 학습자상 심층 매핑 데이터
 * PDF "IB 학습자상 상세 분석 및 판별 가이드" 기반
 */

import { CareerIBMapping } from '@/lib/types/ib-enhanced';
import { CareerCategory, IBLearnerProfile } from '@/lib/types/assessment';

/**
 * 직업군별 IB 프로필 심층 매핑
 */
export const CAREER_IB_DEEP_MAPPING: Record<CareerCategory, CareerIBMapping> = {
  creative: {
    category: 'creative',
    categoryKo: '창의·예술형',
    primaryProfiles: ['Open-minded', 'Risk-taker', 'Communicator'],
    secondaryProfiles: ['Inquirer', 'Thinker', 'Reflective'],
    competencies: [
      '창의적 문제해결',
      '표현력',
      '혁신적 사고',
      '미적 감각',
      '독창성'
    ],
    futureFields: [
      '디자이너 (UX/UI, 그래픽, 제품)',
      '예술가 (화가, 조각가, 설치미술가)',
      '콘텐츠 크리에이터',
      '작가/시나리오 작가',
      '마케터/광고기획자',
      '건축가',
      '뮤지션/작곡가',
      '영화감독/연출가'
    ],
    activities: [
      '미술 및 공예 활동',
      '창작 글쓰기',
      '음악 및 연주',
      '영상 제작',
      '디자인 프로젝트',
      '연극 및 공연'
    ]
  },

  analytical: {
    category: 'analytical',
    categoryKo: '분석·연구형',
    primaryProfiles: ['Inquirer', 'Thinker', 'Knowledgeable'],
    secondaryProfiles: ['Reflective', 'Principled', 'Balanced'],
    competencies: [
      '분석적 사고',
      '연구 역량',
      '논리적 추론',
      '비판적 사고',
      '데이터 해석'
    ],
    futureFields: [
      '과학자 (물리학, 화학, 생물학)',
      '연구원',
      '데이터 분석가/과학자',
      '엔지니어 (소프트웨어, 기계, 전기)',
      '의사/의학연구자',
      '교수/학자',
      '경제학자',
      '법률전문가'
    ],
    activities: [
      '과학 실험',
      '수학 문제 풀이',
      '논리 게임 및 퍼즐',
      '연구 프로젝트',
      '코딩 및 프로그래밍',
      '독서 및 토론'
    ]
  },

  caring: {
    category: 'caring',
    categoryKo: '사람·돌봄형',
    primaryProfiles: ['Caring', 'Communicator', 'Principled'],
    secondaryProfiles: ['Open-minded', 'Balanced', 'Reflective'],
    competencies: [
      '공감 능력',
      '대인관계',
      '윤리의식',
      '소통 능력',
      '서비스 마인드'
    ],
    futureFields: [
      '교사/교육자',
      '상담사/심리치료사',
      '사회복지사',
      '의료인 (간호사, 의사)',
      'NGO/비영리 활동가',
      '인사담당자',
      '종교지도자',
      '코치/멘토'
    ],
    activities: [
      '봉사 활동',
      '또래 멘토링',
      '동물 돌보기',
      '환경 보호 활동',
      '감정 일기 쓰기',
      '공감 대화 연습'
    ]
  },

  leadership: {
    category: 'leadership',
    categoryKo: '리더·조직형',
    primaryProfiles: ['Risk-taker', 'Communicator', 'Principled'],
    secondaryProfiles: ['Thinker', 'Knowledgeable', 'Balanced'],
    competencies: [
      '리더십',
      '의사결정',
      '비전 제시',
      '조직 관리',
      '협상력'
    ],
    futureFields: [
      '경영자/CEO',
      '정치인',
      '기업가/창업가',
      '프로젝트 매니저',
      '외교관',
      '군 장교',
      '스포츠 감독',
      '이벤트 기획자'
    ],
    activities: [
      '학생회/동아리 활동',
      '팀 프로젝트 리드',
      '토론 및 디베이트',
      '창업 아이디어 대회',
      '리더십 캠프',
      '사회 이슈 캠페인'
    ]
  },

  practical: {
    category: 'practical',
    categoryKo: '실무·기술형',
    primaryProfiles: ['Balanced', 'Knowledgeable', 'Risk-taker'],
    secondaryProfiles: ['Thinker', 'Inquirer', 'Reflective'],
    competencies: [
      '실행력',
      '기술 역량',
      '문제해결',
      '꼼꼼함',
      '손재주'
    ],
    futureFields: [
      '엔지니어 (기계, 전자, 건축)',
      '기술자/기능인',
      '건축가',
      '요리사/셰프',
      '장인/공예가',
      '운동선수',
      '파일럿',
      '수의사'
    ],
    activities: [
      '만들기/조립 활동',
      '요리 및 베이킹',
      '운동 및 스포츠',
      '야외 활동/캠핑',
      '기계 분해 및 조립',
      '정원 가꾸기'
    ]
  }
};

/**
 * IB 프로필별 비즈니스 역량 상세 매핑
 */
export const IB_BUSINESS_COMPETENCY_MAP: Record<IBLearnerProfile, {
  primaryCompetency: string;
  secondaryCompetencies: string[];
  leadershipStyle?: string;
  workEnvironment: string[];
  careerStrengths: string[];
}> = {
  Inquirer: {
    primaryCompetency: 'Learning Agility (학습 민첩성)',
    secondaryCompetencies: ['R&D 역량', '비판적 사고', '문제 발견'],
    leadershipStyle: '탐구형 리더 - 질문과 발견으로 팀을 이끔',
    workEnvironment: ['연구소', '대학', 'R&D 센터', '스타트업'],
    careerStrengths: ['새로운 지식 습득', '혁신적 문제해결', '평생학습']
  },
  Knowledgeable: {
    primaryCompetency: 'Subject Matter Expertise (전문성)',
    secondaryCompetencies: ['지식 통합', '학제간 연결', '정보 분석'],
    leadershipStyle: '전문가형 리더 - 깊은 지식으로 방향 제시',
    workEnvironment: ['대학/학계', '연구기관', '컨설팅', '싱크탱크'],
    careerStrengths: ['전문 지식', '통합적 사고', '지식 전달']
  },
  Thinker: {
    primaryCompetency: 'Strategic Thinking (전략적 사고)',
    secondaryCompetencies: ['분석력', '창의적 문제해결', '의사결정'],
    leadershipStyle: '전략가형 리더 - 분석과 창의로 전략 수립',
    workEnvironment: ['전략 기획', '컨설팅', '경영', '법률'],
    careerStrengths: ['복잡한 문제 해결', '논리적 분석', '전략 수립']
  },
  Communicator: {
    primaryCompetency: 'Stakeholder Management (이해관계자 관리)',
    secondaryCompetencies: ['협상력', '프레젠테이션', '팀 협업'],
    leadershipStyle: '소통형 리더 - 대화와 협력으로 팀을 통합',
    workEnvironment: ['마케팅', 'PR', '인사', '영업', '교육'],
    careerStrengths: ['명확한 의사전달', '관계 구축', '팀 협업']
  },
  Principled: {
    primaryCompetency: 'Ethics & Compliance (윤리와 컴플라이언스)',
    secondaryCompetencies: ['정직성', '책임감', '공정성'],
    leadershipStyle: '원칙형 리더 - 정직과 공정으로 신뢰 구축',
    workEnvironment: ['법률', '감사', '컴플라이언스', 'ESG'],
    careerStrengths: ['윤리적 판단', '신뢰 구축', '책임감']
  },
  'Open-minded': {
    primaryCompetency: 'Cross-cultural Competence (다문화 역량)',
    secondaryCompetencies: ['유연성', '다양성 존중', '적응력'],
    leadershipStyle: '포용형 리더 - 다양성을 존중하고 포용',
    workEnvironment: ['글로벌 기업', '외교', '국제기구', '다국적 팀'],
    careerStrengths: ['문화 적응', '다양한 관점 수용', '글로벌 협업']
  },
  Caring: {
    primaryCompetency: 'Emotional Intelligence (감성지능)',
    secondaryCompetencies: ['공감능력', '서비스 마인드', '팀 지원'],
    leadershipStyle: '서번트 리더 - 팀원의 성장과 웰빙 우선',
    workEnvironment: ['의료', '교육', '상담', '사회복지', '인사'],
    careerStrengths: ['공감과 배려', '관계 형성', '팀 화합']
  },
  'Risk-taker': {
    primaryCompetency: 'Entrepreneurship (기업가 정신)',
    secondaryCompetencies: ['도전정신', '회복탄력성', '혁신'],
    leadershipStyle: '도전형 리더 - 새로운 시도로 변화 주도',
    workEnvironment: ['스타트업', '투자', '벤처캐피탈', '모험 산업'],
    careerStrengths: ['새로운 도전', '위기 극복', '혁신 추진']
  },
  Balanced: {
    primaryCompetency: 'Work-Life Integration (일과 삶의 통합)',
    secondaryCompetencies: ['자기관리', '웰빙', '균형감'],
    leadershipStyle: '균형형 리더 - 팀의 웰빙과 성과 균형',
    workEnvironment: ['HR', '웰니스', '코칭', '조직문화'],
    careerStrengths: ['지속가능한 성과', '스트레스 관리', '조화로운 관계']
  },
  Reflective: {
    primaryCompetency: 'Self-Development (자기개발)',
    secondaryCompetencies: ['자기인식', '피드백 수용', '지속적 성장'],
    leadershipStyle: '성찰형 리더 - 배움과 개선을 통한 성장',
    workEnvironment: ['코칭', '멘토링', '교육', '리더십 개발'],
    careerStrengths: ['자기성찰', '지속적 개선', '피드백 활용']
  }
};

/**
 * 직업군에 맞는 IB 프로필 추천 (우선순위)
 */
export function getRecommendedProfilesForCareer(category: CareerCategory): {
  primary: IBLearnerProfile[];
  secondary: IBLearnerProfile[];
} {
  const mapping = CAREER_IB_DEEP_MAPPING[category];
  return {
    primary: mapping.primaryProfiles,
    secondary: mapping.secondaryProfiles
  };
}

/**
 * IB 프로필에 맞는 직업군 추천
 */
export function getRecommendedCareersForProfile(profileId: IBLearnerProfile): CareerCategory[] {
  const categories: CareerCategory[] = [];

  for (const [category, mapping] of Object.entries(CAREER_IB_DEEP_MAPPING)) {
    if (mapping.primaryProfiles.includes(profileId)) {
      categories.unshift(category as CareerCategory); // 우선 추가
    } else if (mapping.secondaryProfiles.includes(profileId)) {
      categories.push(category as CareerCategory);
    }
  }

  return categories;
}

/**
 * IB 프로필과 직업군의 매칭 점수 계산
 */
export function calculateProfileCareerMatch(
  profiles: { profile: IBLearnerProfile; score: number }[],
  category: CareerCategory
): number {
  const mapping = CAREER_IB_DEEP_MAPPING[category];
  let matchScore = 0;

  profiles.forEach(({ profile, score }) => {
    if (mapping.primaryProfiles.includes(profile)) {
      matchScore += score * 1.5; // 주요 프로필은 1.5배 가중치
    } else if (mapping.secondaryProfiles.includes(profile)) {
      matchScore += score * 1.0; // 부수 프로필은 1배 가중치
    } else {
      matchScore += score * 0.3; // 기타 프로필은 0.3배 가중치
    }
  });

  return Math.min(100, Math.round(matchScore));
}

/**
 * 연령대별 활동 추천
 */
export function getActivitiesForCareerAndAge(
  category: CareerCategory,
  age: number
): string[] {
  const mapping = CAREER_IB_DEEP_MAPPING[category];
  const activities = mapping.activities;

  // 연령대별 필터링 (필요시 확장)
  if (age <= 7) {
    return activities.slice(0, 3); // 저연령용은 앞 3개
  } else if (age <= 10) {
    return activities.slice(0, 4); // 중간 연령은 앞 4개
  } else {
    return activities; // 고연령은 전체
  }
}

/**
 * 종합 진로 추천 리포트 생성
 */
export function generateCareerRecommendation(
  topCategories: CareerCategory[],
  topProfiles: IBLearnerProfile[],
  age: number
): {
  recommendedFields: string[];
  keyCompetencies: string[];
  developmentActivities: string[];
  leadershipPotential: string;
} {
  const primaryCategory = topCategories[0];
  const primaryProfile = topProfiles[0];

  const careerMapping = CAREER_IB_DEEP_MAPPING[primaryCategory];
  const profileMapping = IB_BUSINESS_COMPETENCY_MAP[primaryProfile];

  return {
    recommendedFields: careerMapping.futureFields.slice(0, 5),
    keyCompetencies: [
      profileMapping.primaryCompetency,
      ...careerMapping.competencies.slice(0, 3)
    ],
    developmentActivities: getActivitiesForCareerAndAge(primaryCategory, age),
    leadershipPotential: profileMapping.leadershipStyle || '잠재적 리더십 특성 발견 중'
  };
}
