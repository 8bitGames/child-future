import { CareerCategory, MajorRecommendation } from '@/lib/types/result';

// 직업군별 추천 전공
export const MAJOR_DATABASE: Record<CareerCategory, MajorRecommendation[]> = {
  creative: [
    {
      name: '시각디자인학과',
      category: 'creative',
      universities: ['홍익대', '서울대', '이화여대']
    },
    {
      name: '영상콘텐츠학과',
      category: 'creative',
      universities: ['한국예술종합학교', '중앙대', '동국대']
    },
    {
      name: '문예창작과',
      category: 'creative',
      universities: ['서울예대', '동국대', '명지대']
    },
    {
      name: '애니메이션과',
      category: 'creative',
      universities: ['한국예술종합학교', '상명대', '세종대']
    },
    {
      name: '건축학과',
      category: 'creative',
      universities: ['서울대', '연세대', '한양대']
    },
    {
      name: '산업디자인과',
      category: 'creative',
      universities: ['카이스트', '홍익대', '이화여대']
    },
    {
      name: '패션디자인과',
      category: 'creative',
      universities: ['이화여대', '홍익대', '한양대']
    }
  ],

  analytical: [
    {
      name: '컴퓨터공학과',
      category: 'analytical',
      universities: ['카이스트', '서울대', '포스텍']
    },
    {
      name: '수학과',
      category: 'analytical',
      universities: ['서울대', '카이스트', '고려대']
    },
    {
      name: '물리학과',
      category: 'analytical',
      universities: ['서울대', '카이스트', '포스텍']
    },
    {
      name: '데이터사이언스학과',
      category: 'analytical',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '화학과',
      category: 'analytical',
      universities: ['서울대', '카이스트', '연세대']
    },
    {
      name: '생명과학과',
      category: 'analytical',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '통계학과',
      category: 'analytical',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '천문우주학과',
      category: 'analytical',
      universities: ['서울대', '연세대', '경희대']
    }
  ],

  caring: [
    {
      name: '교육학과',
      category: 'caring',
      universities: ['서울대', '이화여대', '고려대']
    },
    {
      name: '유아교육과',
      category: 'caring',
      universities: ['이화여대', '중앙대', '숙명여대']
    },
    {
      name: '심리학과',
      category: 'caring',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '사회복지학과',
      category: 'caring',
      universities: ['서울대', '연세대', '이화여대']
    },
    {
      name: '간호학과',
      category: 'caring',
      universities: ['서울대', '연세대', '가톨릭대']
    },
    {
      name: '수의학과',
      category: 'caring',
      universities: ['서울대', '건국대', '전북대']
    },
    {
      name: '의예과',
      category: 'caring',
      universities: ['서울대', '연세대', '가톨릭대']
    },
    {
      name: '상담학과',
      category: 'caring',
      universities: ['서울대', '연세대', '이화여대']
    }
  ],

  leadership: [
    {
      name: '경영학과',
      category: 'leadership',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '행정학과',
      category: 'leadership',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '국제학과',
      category: 'leadership',
      universities: ['서울대', '연세대', '한국외대']
    },
    {
      name: '미디어커뮤니케이션학과',
      category: 'leadership',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '광고홍보학과',
      category: 'leadership',
      universities: ['중앙대', '한양대', '서강대']
    },
    {
      name: '경제학과',
      category: 'leadership',
      universities: ['서울대', '연세대', '고려대']
    },
    {
      name: '정치외교학과',
      category: 'leadership',
      universities: ['서울대', '연세대', '고려대']
    }
  ],

  practical: [
    {
      name: '기계공학과',
      category: 'practical',
      universities: ['카이스트', '서울대', '포스텍']
    },
    {
      name: '스포츠과학과',
      category: 'practical',
      universities: ['서울대', '연세대', '한양대']
    },
    {
      name: '자동차공학과',
      category: 'practical',
      universities: ['한양대', '아주대', '인하대']
    },
    {
      name: '건축공학과',
      category: 'practical',
      universities: ['서울대', '한양대', '연세대']
    },
    {
      name: '항공우주공학과',
      category: 'practical',
      universities: ['카이스트', '서울대', '한양대']
    },
    {
      name: '로봇공학과',
      category: 'practical',
      universities: ['카이스트', '한양대', '고려대']
    },
    {
      name: '식품영양학과',
      category: 'practical',
      universities: ['서울대', '연세대', '이화여대']
    },
    {
      name: '전기전자공학과',
      category: 'practical',
      universities: ['카이스트', '서울대', '포스텍']
    }
  ]
};

// 직업군별 대표 전공
export function getTopMajors(category: CareerCategory, count: number = 4): MajorRecommendation[] {
  return MAJOR_DATABASE[category].slice(0, count);
}

// 모든 전공 목록
export function getAllMajors(): MajorRecommendation[] {
  return Object.values(MAJOR_DATABASE).flat();
}
