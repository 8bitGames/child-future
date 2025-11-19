import { CareerCategory, JobRecommendation } from '@/lib/types/result';

// 직업군별 직업 데이터베이스
export const CAREER_DATABASE: Record<CareerCategory, JobRecommendation[]> = {
  creative: [
    {
      title: '일러스트레이터',
      category: 'creative',
      description: '그림과 디자인으로 이야기를 전달하는 직업',
      icon: '🎨'
    },
    {
      title: '게임 디자이너',
      category: 'creative',
      description: '재미있는 게임을 기획하고 만드는 직업',
      icon: '🎮'
    },
    {
      title: '그래픽 디자이너',
      category: 'creative',
      description: '포스터, 로고, 광고 등을 디자인하는 직업',
      icon: '🖼️'
    },
    {
      title: '작가',
      category: 'creative',
      description: '소설, 동화, 시나리오 등을 쓰는 직업',
      icon: '✍️'
    },
    {
      title: '영상 편집자',
      category: 'creative',
      description: '영상을 편집하고 특수효과를 만드는 직업',
      icon: '🎬'
    },
    {
      title: '애니메이터',
      category: 'creative',
      description: '캐릭터와 이야기에 생명을 불어넣는 직업',
      icon: '🎞️'
    },
    {
      title: '건축가',
      category: 'creative',
      description: '아름답고 실용적인 건물을 설계하는 직업',
      icon: '🏛️'
    },
    {
      title: '패션 디자이너',
      category: 'creative',
      description: '옷과 액세서리를 디자인하는 직업',
      icon: '👗'
    }
  ],

  analytical: [
    {
      title: '프로그래머',
      category: 'analytical',
      description: '코드로 문제를 해결하고 프로그램을 만드는 직업',
      icon: '💻'
    },
    {
      title: '데이터 분석가',
      category: 'analytical',
      description: '데이터에서 의미 있는 패턴을 찾아내는 직업',
      icon: '📊'
    },
    {
      title: '과학자',
      category: 'analytical',
      description: '자연 현상을 연구하고 새로운 발견을 하는 직업',
      icon: '🔬'
    },
    {
      title: '수학자',
      category: 'analytical',
      description: '수학 이론을 연구하고 응용하는 직업',
      icon: '🔢'
    },
    {
      title: '연구원',
      category: 'analytical',
      description: '다양한 분야에서 새로운 지식을 탐구하는 직업',
      icon: '🧪'
    },
    {
      title: '천문학자',
      category: 'analytical',
      description: '우주와 천체를 연구하는 직업',
      icon: '🔭'
    },
    {
      title: 'AI 개발자',
      category: 'analytical',
      description: '인공지능을 만들고 발전시키는 직업',
      icon: '🤖'
    },
    {
      title: '경제학자',
      category: 'analytical',
      description: '경제 현상을 분석하고 예측하는 직업',
      icon: '📈'
    }
  ],

  caring: [
    {
      title: '교사',
      category: 'caring',
      description: '학생들을 가르치고 성장을 돕는 직업',
      icon: '👨‍🏫'
    },
    {
      title: '상담사',
      category: 'caring',
      description: '사람들의 고민을 듣고 해결을 돕는 직업',
      icon: '💬'
    },
    {
      title: '간호사',
      category: 'caring',
      description: '환자를 돌보고 치료를 돕는 직업',
      icon: '👩‍⚕️'
    },
    {
      title: '사회복지사',
      category: 'caring',
      description: '도움이 필요한 사람들을 지원하는 직업',
      icon: '🤝'
    },
    {
      title: '유아교사',
      category: 'caring',
      description: '어린이들의 첫 배움을 이끄는 직업',
      icon: '👶'
    },
    {
      title: '수의사',
      category: 'caring',
      description: '동물을 치료하고 건강을 돌보는 직업',
      icon: '🐕'
    },
    {
      title: '심리학자',
      category: 'caring',
      description: '사람의 마음을 연구하고 돕는 직업',
      icon: '🧠'
    },
    {
      title: '의사',
      category: 'caring',
      description: '환자를 진단하고 치료하는 직업',
      icon: '⚕️'
    }
  ],

  leadership: [
    {
      title: '프로젝트 매니저',
      category: 'leadership',
      description: '프로젝트를 기획하고 팀을 이끄는 직업',
      icon: '📋'
    },
    {
      title: '기획자',
      category: 'leadership',
      description: '새로운 아이디어를 계획하고 실행하는 직업',
      icon: '💡'
    },
    {
      title: '창업가',
      category: 'leadership',
      description: '새로운 사업을 시작하고 운영하는 직업',
      icon: '🚀'
    },
    {
      title: '마케터',
      category: 'leadership',
      description: '제품이나 서비스를 알리고 판매를 늘리는 직업',
      icon: '📱'
    },
    {
      title: '이벤트 기획자',
      category: 'leadership',
      description: '행사를 기획하고 진행하는 직업',
      icon: '🎉'
    },
    {
      title: '방송 PD',
      category: 'leadership',
      description: '방송 프로그램을 기획하고 제작하는 직업',
      icon: '📺'
    },
    {
      title: '경영 컨설턴트',
      category: 'leadership',
      description: '기업의 문제를 분석하고 해결책을 제시하는 직업',
      icon: '💼'
    },
    {
      title: '정치인',
      category: 'leadership',
      description: '사회 문제를 해결하고 정책을 만드는 직업',
      icon: '🏛️'
    }
  ],

  practical: [
    {
      title: '엔지니어',
      category: 'practical',
      description: '기계와 시스템을 설계하고 만드는 직업',
      icon: '⚙️'
    },
    {
      title: '운동선수',
      category: 'practical',
      description: '운동 경기에서 최고의 실력을 발휘하는 직업',
      icon: '⚽'
    },
    {
      title: '요리사',
      category: 'practical',
      description: '맛있는 음식을 만드는 직업',
      icon: '👨‍🍳'
    },
    {
      title: '트레이너',
      category: 'practical',
      description: '사람들의 운동과 건강을 지도하는 직업',
      icon: '💪'
    },
    {
      title: '파일럿',
      category: 'practical',
      description: '비행기를 조종하는 직업',
      icon: '✈️'
    },
    {
      title: '건축 기술자',
      category: 'practical',
      description: '건물을 짓고 관리하는 직업',
      icon: '🏗️'
    },
    {
      title: '자동차 정비사',
      category: 'practical',
      description: '자동차를 수리하고 관리하는 직업',
      icon: '🚗'
    },
    {
      title: '로봇 공학자',
      category: 'practical',
      description: '로봇을 설계하고 제작하는 직업',
      icon: '🤖'
    }
  ]
};

// 직업군별 대표 직업 (결과 화면에서 주로 표시)
export function getTopJobs(category: CareerCategory, count: number = 5): JobRecommendation[] {
  return CAREER_DATABASE[category].slice(0, count);
}

// 모든 직업 목록
export function getAllJobs(): JobRecommendation[] {
  return Object.values(CAREER_DATABASE).flat();
}
