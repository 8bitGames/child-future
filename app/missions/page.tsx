'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLatestResult } from '@/lib/utils/storage';
import { AssessmentResult, IBProfile, IB_PROFILE_NAMES } from '@/lib/types/result';
import {
  ArrowLeft,
  Target,
  Star,
  Trophy,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Award,
  Zap,
  Heart,
  BookOpen,
  Users,
  Lightbulb,
  Compass,
  Shield,
  Scale,
  Brain,
  RefreshCw,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

// 미션 타입 정의
interface Mission {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'special';
  ibProfile: IBProfile;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  steps: MissionStep[];
  badge?: Badge;
  estimatedTime: string;
  tags: string[];
}

interface MissionStep {
  id: string;
  description: string;
  completed: boolean;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface UserMission {
  missionId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  steps: { stepId: string; completed: boolean }[];
  startedAt?: string;
  completedAt?: string;
  earnedPoints: number;
}

// IB 프로필별 아이콘
const IB_PROFILE_ICONS: Record<IBProfile, React.ReactNode> = {
  'Inquirer': <Compass className="w-5 h-5" />,
  'Knowledgeable': <BookOpen className="w-5 h-5" />,
  'Thinker': <Brain className="w-5 h-5" />,
  'Communicator': <Users className="w-5 h-5" />,
  'Principled': <Shield className="w-5 h-5" />,
  'Open-minded': <Lightbulb className="w-5 h-5" />,
  'Caring': <Heart className="w-5 h-5" />,
  'Risk-taker': <Zap className="w-5 h-5" />,
  'Balanced': <Scale className="w-5 h-5" />,
  'Reflective': <Star className="w-5 h-5" />
};

// IB 프로필별 색상
const IB_PROFILE_COLORS: Record<IBProfile, string> = {
  'Inquirer': 'bg-purple-100 text-purple-700 border-purple-200',
  'Knowledgeable': 'bg-blue-100 text-blue-700 border-blue-200',
  'Thinker': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Communicator': 'bg-green-100 text-green-700 border-green-200',
  'Principled': 'bg-amber-100 text-amber-700 border-amber-200',
  'Open-minded': 'bg-teal-100 text-teal-700 border-teal-200',
  'Caring': 'bg-rose-100 text-rose-700 border-rose-200',
  'Risk-taker': 'bg-orange-100 text-orange-700 border-orange-200',
  'Balanced': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Reflective': 'bg-violet-100 text-violet-700 border-violet-200'
};

// 미션 템플릿 데이터베이스
const MISSION_TEMPLATES: Mission[] = [
  // 탐구하는 사람 (Inquirer) 미션
  {
    id: 'inquirer-daily-1',
    title: '오늘의 궁금증 탐험',
    description: '오늘 하루 동안 궁금한 것 3가지를 찾아 적어보세요',
    category: 'daily',
    ibProfile: 'Inquirer',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '15분',
    tags: ['호기심', '질문', '탐구'],
    steps: [
      { id: 's1', description: '오늘 궁금한 것 3가지 적기', completed: false },
      { id: 's2', description: '가장 궁금한 것 1가지 선택하기', completed: false },
      { id: 's3', description: '선택한 주제에 대해 조사하기', completed: false }
    ],
    badge: { id: 'curious-cat', name: '호기심 고양이', icon: '🐱', description: '궁금증을 탐험하는 탐구자' }
  },
  {
    id: 'inquirer-weekly-1',
    title: '미니 과학 실험',
    description: '집에서 할 수 있는 간단한 과학 실험을 해보세요',
    category: 'weekly',
    ibProfile: 'Inquirer',
    difficulty: 'medium',
    points: 30,
    estimatedTime: '1시간',
    tags: ['과학', '실험', '발견'],
    steps: [
      { id: 's1', description: '실험 주제 선택하기', completed: false },
      { id: 's2', description: '필요한 재료 준비하기', completed: false },
      { id: 's3', description: '실험 진행하기', completed: false },
      { id: 's4', description: '결과 기록하기', completed: false },
      { id: 's5', description: '왜 그런 결과가 나왔는지 생각해보기', completed: false }
    ],
    badge: { id: 'young-scientist', name: '꼬마 과학자', icon: '🔬', description: '실험으로 세상을 탐구하는 과학자' }
  },

  // 지식을 쌓는 사람 (Knowledgeable) 미션
  {
    id: 'knowledgeable-daily-1',
    title: '오늘의 새 단어',
    description: '새로운 단어 3개를 배우고 문장으로 만들어보세요',
    category: 'daily',
    ibProfile: 'Knowledgeable',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '20분',
    tags: ['어휘', '학습', '언어'],
    steps: [
      { id: 's1', description: '새 단어 3개 찾기', completed: false },
      { id: 's2', description: '각 단어의 뜻 적기', completed: false },
      { id: 's3', description: '각 단어로 문장 만들기', completed: false }
    ],
    badge: { id: 'word-master', name: '단어 마스터', icon: '📚', description: '매일 새로운 지식을 쌓는 학습자' }
  },
  {
    id: 'knowledgeable-weekly-1',
    title: '주제 깊이 파기',
    description: '관심 있는 주제를 선택해서 깊이 있게 알아보세요',
    category: 'weekly',
    ibProfile: 'Knowledgeable',
    difficulty: 'hard',
    points: 50,
    estimatedTime: '2시간',
    tags: ['연구', '심화학습', '전문성'],
    steps: [
      { id: 's1', description: '관심 주제 선택하기', completed: false },
      { id: 's2', description: '관련 자료 3개 이상 찾기', completed: false },
      { id: 's3', description: '중요한 내용 정리하기', completed: false },
      { id: 's4', description: '배운 것을 가족에게 설명하기', completed: false }
    ],
    badge: { id: 'knowledge-seeker', name: '지식 탐험가', icon: '🎓', description: '깊이 있는 지식을 추구하는 학자' }
  },

  // 생각하는 사람 (Thinker) 미션
  {
    id: 'thinker-daily-1',
    title: '논리 퍼즐 도전',
    description: '논리 퍼즐이나 문제를 풀어보세요',
    category: 'daily',
    ibProfile: 'Thinker',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '15분',
    tags: ['논리', '퍼즐', '문제해결'],
    steps: [
      { id: 's1', description: '퍼즐 또는 문제 선택하기', completed: false },
      { id: 's2', description: '풀이 과정 기록하기', completed: false },
      { id: 's3', description: '답을 확인하고 검토하기', completed: false }
    ],
    badge: { id: 'puzzle-solver', name: '퍼즐 해결사', icon: '🧩', description: '논리적으로 문제를 해결하는 사고가' }
  },
  {
    id: 'thinker-weekly-1',
    title: '창의적 해결책 찾기',
    description: '일상의 문제를 발견하고 창의적인 해결책을 생각해보세요',
    category: 'weekly',
    ibProfile: 'Thinker',
    difficulty: 'medium',
    points: 30,
    estimatedTime: '1시간',
    tags: ['창의력', '문제해결', '아이디어'],
    steps: [
      { id: 's1', description: '일상에서 불편한 점 찾기', completed: false },
      { id: 's2', description: '문제 구체적으로 정의하기', completed: false },
      { id: 's3', description: '해결 아이디어 5개 이상 적기', completed: false },
      { id: 's4', description: '가장 좋은 아이디어 선택하고 발전시키기', completed: false }
    ],
    badge: { id: 'creative-thinker', name: '창의 사고가', icon: '💡', description: '창의적으로 문제를 해결하는 혁신가' }
  },

  // 소통하는 사람 (Communicator) 미션
  {
    id: 'communicator-daily-1',
    title: '감사 표현하기',
    description: '오늘 고마운 사람에게 감사 표현을 해보세요',
    category: 'daily',
    ibProfile: 'Communicator',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '10분',
    tags: ['감사', '표현', '관계'],
    steps: [
      { id: 's1', description: '고마운 사람 생각하기', completed: false },
      { id: 's2', description: '감사한 이유 적어보기', completed: false },
      { id: 's3', description: '직접 또는 카드로 감사 전하기', completed: false }
    ],
    badge: { id: 'gratitude-giver', name: '감사 전달자', icon: '💌', description: '감사를 표현할 줄 아는 소통가' }
  },
  {
    id: 'communicator-weekly-1',
    title: '이야기 만들기',
    description: '짧은 이야기를 만들고 가족에게 들려주세요',
    category: 'weekly',
    ibProfile: 'Communicator',
    difficulty: 'medium',
    points: 30,
    estimatedTime: '1시간',
    tags: ['창작', '스토리텔링', '표현'],
    steps: [
      { id: 's1', description: '이야기 주제 정하기', completed: false },
      { id: 's2', description: '등장인물 만들기', completed: false },
      { id: 's3', description: '이야기 전개 구성하기', completed: false },
      { id: 's4', description: '이야기 완성하기', completed: false },
      { id: 's5', description: '가족에게 읽어주기', completed: false }
    ],
    badge: { id: 'storyteller', name: '이야기꾼', icon: '📖', description: '이야기로 마음을 전하는 소통가' }
  },

  // 원칙을 지키는 사람 (Principled) 미션
  {
    id: 'principled-daily-1',
    title: '약속 지키기',
    description: '오늘 하루 작은 약속을 정하고 꼭 지켜보세요',
    category: 'daily',
    ibProfile: 'Principled',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '하루 종일',
    tags: ['약속', '책임감', '신뢰'],
    steps: [
      { id: 's1', description: '오늘 지킬 약속 정하기', completed: false },
      { id: 's2', description: '약속을 지키기 위해 노력하기', completed: false },
      { id: 's3', description: '하루 끝에 결과 확인하기', completed: false }
    ],
    badge: { id: 'promise-keeper', name: '약속 지킴이', icon: '🤝', description: '약속을 소중히 지키는 신뢰인' }
  },
  {
    id: 'principled-weekly-1',
    title: '공정한 심판 되기',
    description: '가족 게임에서 공정한 심판 역할을 해보세요',
    category: 'weekly',
    ibProfile: 'Principled',
    difficulty: 'medium',
    points: 25,
    estimatedTime: '1시간',
    tags: ['공정', '판단', '규칙'],
    steps: [
      { id: 's1', description: '가족 게임 선택하기', completed: false },
      { id: 's2', description: '규칙 먼저 설명하기', completed: false },
      { id: 's3', description: '공정하게 심판 보기', completed: false },
      { id: 's4', description: '모두가 즐겁게 마무리하기', completed: false }
    ],
    badge: { id: 'fair-judge', name: '공정한 심판', icon: '⚖️', description: '공정함을 실천하는 정의로운 사람' }
  },

  // 열린 마음을 가진 사람 (Open-minded) 미션
  {
    id: 'openminded-daily-1',
    title: '새로운 것 체험하기',
    description: '오늘 처음 해보는 것을 하나 시도해보세요',
    category: 'daily',
    ibProfile: 'Open-minded',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '30분',
    tags: ['도전', '새로움', '경험'],
    steps: [
      { id: 's1', description: '오늘 새롭게 시도할 것 정하기', completed: false },
      { id: 's2', description: '시도해보기', completed: false },
      { id: 's3', description: '느낀 점 기록하기', completed: false }
    ],
    badge: { id: 'new-explorer', name: '새로움 탐험가', icon: '🌈', description: '새로운 것을 두려워하지 않는 모험가' }
  },
  {
    id: 'openminded-weekly-1',
    title: '다른 나라 문화 탐험',
    description: '다른 나라의 문화를 알아보고 체험해보세요',
    category: 'weekly',
    ibProfile: 'Open-minded',
    difficulty: 'medium',
    points: 35,
    estimatedTime: '1시간 30분',
    tags: ['문화', '세계', '다양성'],
    steps: [
      { id: 's1', description: '알아볼 나라 선택하기', completed: false },
      { id: 's2', description: '그 나라의 인사말 배우기', completed: false },
      { id: 's3', description: '전통 음식 알아보기', completed: false },
      { id: 's4', description: '흥미로운 문화 3가지 정리하기', completed: false }
    ],
    badge: { id: 'world-citizen', name: '세계 시민', icon: '🌍', description: '다양한 문화를 존중하는 열린 마음' }
  },

  // 배려하는 사람 (Caring) 미션
  {
    id: 'caring-daily-1',
    title: '친절 실천하기',
    description: '오늘 누군가에게 친절한 행동을 해보세요',
    category: 'daily',
    ibProfile: 'Caring',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '15분',
    tags: ['친절', '봉사', '나눔'],
    steps: [
      { id: 's1', description: '친절한 행동 계획하기', completed: false },
      { id: 's2', description: '실천하기', completed: false },
      { id: 's3', description: '상대방의 반응과 내 기분 기록하기', completed: false }
    ],
    badge: { id: 'kind-helper', name: '친절 도우미', icon: '💕', description: '따뜻한 마음으로 돕는 배려인' }
  },
  {
    id: 'caring-weekly-1',
    title: '가족 돕기 프로젝트',
    description: '일주일 동안 가족을 도울 방법을 찾아 실천해보세요',
    category: 'weekly',
    ibProfile: 'Caring',
    difficulty: 'medium',
    points: 30,
    estimatedTime: '매일 20분',
    tags: ['가족', '봉사', '책임'],
    steps: [
      { id: 's1', description: '가족이 필요한 도움 알아보기', completed: false },
      { id: 's2', description: '도울 수 있는 일 3가지 정하기', completed: false },
      { id: 's3', description: '매일 1가지씩 실천하기', completed: false },
      { id: 's4', description: '일주일 후 가족에게 피드백 받기', completed: false }
    ],
    badge: { id: 'family-helper', name: '가족 서포터', icon: '👨‍👩‍👧‍👦', description: '가족을 사랑으로 돕는 배려인' }
  },

  // 도전하는 사람 (Risk-taker) 미션
  {
    id: 'risktaker-daily-1',
    title: '용기 내어 말하기',
    description: '평소 말하기 어려웠던 것을 용기 내어 말해보세요',
    category: 'daily',
    ibProfile: 'Risk-taker',
    difficulty: 'easy',
    points: 15,
    estimatedTime: '10분',
    tags: ['용기', '표현', '도전'],
    steps: [
      { id: 's1', description: '말하고 싶었던 것 정하기', completed: false },
      { id: 's2', description: '용기 내어 말하기', completed: false },
      { id: 's3', description: '결과와 느낀 점 기록하기', completed: false }
    ],
    badge: { id: 'brave-speaker', name: '용감한 발언자', icon: '🎤', description: '용기 있게 목소리를 내는 도전가' }
  },
  {
    id: 'risktaker-weekly-1',
    title: '새로운 기술 도전',
    description: '배워보고 싶었던 새로운 기술에 도전해보세요',
    category: 'weekly',
    ibProfile: 'Risk-taker',
    difficulty: 'hard',
    points: 40,
    estimatedTime: '2시간',
    tags: ['학습', '도전', '성장'],
    steps: [
      { id: 's1', description: '배우고 싶은 기술 선택하기', completed: false },
      { id: 's2', description: '학습 자료 찾기', completed: false },
      { id: 's3', description: '기초 연습하기', completed: false },
      { id: 's4', description: '작은 결과물 만들기', completed: false },
      { id: 's5', description: '배운 것 가족에게 보여주기', completed: false }
    ],
    badge: { id: 'skill-challenger', name: '기술 도전가', icon: '🚀', description: '새로운 것에 도전하는 용감한 학습자' }
  },

  // 균형 잡힌 사람 (Balanced) 미션
  {
    id: 'balanced-daily-1',
    title: '균형 잡힌 하루',
    description: '공부, 운동, 놀이를 균형 있게 해보세요',
    category: 'daily',
    ibProfile: 'Balanced',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '하루 종일',
    tags: ['균형', '일과', '건강'],
    steps: [
      { id: 's1', description: '오늘 할 공부 정하기', completed: false },
      { id: 's2', description: '운동 또는 신체 활동하기', completed: false },
      { id: 's3', description: '좋아하는 놀이하기', completed: false }
    ],
    badge: { id: 'balance-master', name: '균형 달인', icon: '🎯', description: '삶의 균형을 유지하는 현명한 사람' }
  },
  {
    id: 'balanced-weekly-1',
    title: '마음 챙김 주간',
    description: '일주일 동안 매일 마음 챙김 시간을 가져보세요',
    category: 'weekly',
    ibProfile: 'Balanced',
    difficulty: 'medium',
    points: 30,
    estimatedTime: '매일 10분',
    tags: ['명상', '마음챙김', '정서'],
    steps: [
      { id: 's1', description: '매일 같은 시간에 조용한 시간 갖기', completed: false },
      { id: 's2', description: '심호흡 5회 하기', completed: false },
      { id: 's3', description: '오늘 감사한 것 1가지 생각하기', completed: false },
      { id: 's4', description: '일주일 후 변화 기록하기', completed: false }
    ],
    badge: { id: 'mindful-one', name: '마음챙김 수련자', icon: '🧘', description: '마음의 평화를 가꾸는 균형인' }
  },

  // 성찰하는 사람 (Reflective) 미션
  {
    id: 'reflective-daily-1',
    title: '오늘 하루 돌아보기',
    description: '하루를 마무리하며 오늘을 돌아보세요',
    category: 'daily',
    ibProfile: 'Reflective',
    difficulty: 'easy',
    points: 10,
    estimatedTime: '15분',
    tags: ['성찰', '일기', '자기이해'],
    steps: [
      { id: 's1', description: '오늘 가장 좋았던 일 적기', completed: false },
      { id: 's2', description: '어려웠던 일과 해결 방법 적기', completed: false },
      { id: 's3', description: '내일 더 잘하고 싶은 것 적기', completed: false }
    ],
    badge: { id: 'daily-reflector', name: '일일 성찰자', icon: '📝', description: '매일 자신을 돌아보는 성찰인' }
  },
  {
    id: 'reflective-weekly-1',
    title: '나의 강점 발견',
    description: '일주일 동안 나의 강점을 찾아보세요',
    category: 'weekly',
    ibProfile: 'Reflective',
    difficulty: 'medium',
    points: 30,
    estimatedTime: '1시간',
    tags: ['자기이해', '강점', '성장'],
    steps: [
      { id: 's1', description: '잘했던 일 5가지 적기', completed: false },
      { id: 's2', description: '각 일에서 사용한 능력 찾기', completed: false },
      { id: 's3', description: '반복되는 강점 3가지 정리하기', completed: false },
      { id: 's4', description: '강점을 더 발휘할 방법 생각하기', completed: false }
    ],
    badge: { id: 'strength-finder', name: '강점 발견자', icon: '💎', description: '자신의 가치를 아는 성찰인' }
  },

  // 스페셜 미션
  {
    id: 'special-family-project',
    title: '가족 프로젝트',
    description: '가족과 함께하는 특별한 프로젝트를 완성해보세요',
    category: 'special',
    ibProfile: 'Communicator',
    difficulty: 'hard',
    points: 100,
    estimatedTime: '3시간',
    tags: ['가족', '협력', '창작'],
    steps: [
      { id: 's1', description: '가족 회의로 프로젝트 주제 정하기', completed: false },
      { id: 's2', description: '각자 역할 나누기', completed: false },
      { id: 's3', description: '필요한 재료 준비하기', completed: false },
      { id: 's4', description: '함께 프로젝트 진행하기', completed: false },
      { id: 's5', description: '완성된 결과물 사진 찍기', completed: false },
      { id: 's6', description: '프로젝트 소감 나누기', completed: false }
    ],
    badge: { id: 'family-champion', name: '가족 챔피언', icon: '👑', description: '가족과 함께 성장하는 협력자' }
  }
];

// 난이도별 색상
const DIFFICULTY_COLORS = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700'
};

const DIFFICULTY_NAMES = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움'
};

export default function MissionsPage() {
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'daily' | 'weekly' | 'special'>('all');
  const [selectedProfile, setSelectedProfile] = useState<IBProfile | 'all'>('all');
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = getLatestResult();
    setLatestResult(result);

    // localStorage에서 미션 데이터 불러오기
    const savedMissions = localStorage.getItem('userMissions');
    const savedPoints = localStorage.getItem('totalPoints');
    const savedBadges = localStorage.getItem('earnedBadges');

    if (savedMissions) setUserMissions(JSON.parse(savedMissions));
    if (savedPoints) setTotalPoints(JSON.parse(savedPoints));
    if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));

    setLoading(false);
  }, []);

  // 데이터 저장
  const saveData = (missions: UserMission[], points: number, badges: Badge[]) => {
    localStorage.setItem('userMissions', JSON.stringify(missions));
    localStorage.setItem('totalPoints', JSON.stringify(points));
    localStorage.setItem('earnedBadges', JSON.stringify(badges));
  };

  // 미션 시작
  const startMission = (missionId: string) => {
    const mission = MISSION_TEMPLATES.find(m => m.id === missionId);
    if (!mission) return;

    const newUserMission: UserMission = {
      missionId,
      status: 'in_progress',
      steps: mission.steps.map(s => ({ stepId: s.id, completed: false })),
      startedAt: new Date().toISOString(),
      earnedPoints: 0
    };

    const updatedMissions = [...userMissions, newUserMission];
    setUserMissions(updatedMissions);
    saveData(updatedMissions, totalPoints, earnedBadges);
  };

  // 스텝 완료 토글
  const toggleStep = (missionId: string, stepId: string) => {
    const updatedMissions = userMissions.map(um => {
      if (um.missionId !== missionId) return um;

      const updatedSteps = um.steps.map(s =>
        s.stepId === stepId ? { ...s, completed: !s.completed } : s
      );

      const allCompleted = updatedSteps.every(s => s.completed);
      const mission = MISSION_TEMPLATES.find(m => m.id === missionId);

      if (allCompleted && um.status !== 'completed' && mission) {
        // 미션 완료!
        const newPoints = totalPoints + mission.points;
        setTotalPoints(newPoints);

        // 배지 획득
        if (mission.badge && !earnedBadges.find(b => b.id === mission.badge?.id)) {
          const newBadges = [...earnedBadges, mission.badge];
          setEarnedBadges(newBadges);
          saveData(userMissions, newPoints, newBadges);
        }

        return {
          ...um,
          steps: updatedSteps,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          earnedPoints: mission.points
        };
      }

      return { ...um, steps: updatedSteps };
    });

    setUserMissions(updatedMissions);
    saveData(updatedMissions, totalPoints, earnedBadges);
  };

  // 미션 초기화
  const resetMission = (missionId: string) => {
    const updatedMissions = userMissions.filter(um => um.missionId !== missionId);
    setUserMissions(updatedMissions);
    saveData(updatedMissions, totalPoints, earnedBadges);
  };

  // 미션 상태 가져오기
  const getMissionStatus = (missionId: string): UserMission | undefined => {
    return userMissions.find(um => um.missionId === missionId);
  };

  // 필터링된 미션
  const filteredMissions = MISSION_TEMPLATES.filter(mission => {
    const categoryMatch = selectedCategory === 'all' || mission.category === selectedCategory;
    const profileMatch = selectedProfile === 'all' || mission.ibProfile === selectedProfile;
    return categoryMatch && profileMatch;
  });

  // 추천 미션 (사용자 상위 IB 프로필 기반)
  const recommendedMissions = latestResult
    ? MISSION_TEMPLATES.filter(m =>
        latestResult.ibProfiles.slice(0, 3).includes(m.ibProfile) &&
        !getMissionStatus(m.id)
      ).slice(0, 3)
    : MISSION_TEMPLATES.filter(m => m.category === 'daily').slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-7 w-7 text-orange-600" />
                활동 미션
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                재미있는 미션을 완료하고 배지를 획득하세요!
              </p>
            </div>
          </div>
        </div>

        {/* 포인트 & 배지 요약 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-200 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-700">총 포인트</p>
                  <p className="text-2xl font-bold text-yellow-800">{totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-full">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-700">획득 배지</p>
                  <p className="text-2xl font-bold text-purple-800">{earnedBadges.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 획득한 배지 표시 */}
        {earnedBadges.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                나의 배지
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {earnedBadges.map(badge => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200"
                    title={badge.description}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{badge.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 추천 미션 */}
        {recommendedMissions.length > 0 && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                {latestResult ? `${latestResult.basicInfo.nickname}님을 위한 추천 미션` : '추천 미션'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedMissions.map(mission => (
                  <div
                    key={mission.id}
                    className="p-3 bg-white rounded-lg border border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setExpandedMission(mission.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`p-1 rounded ${IB_PROFILE_COLORS[mission.ibProfile]}`}>
                        {IB_PROFILE_ICONS[mission.ibProfile]}
                      </span>
                      <span className="font-medium text-sm text-gray-900">{mission.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {mission.points}점
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {mission.estimatedTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 필터 */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* 카테고리 필터 */}
          <div className="flex gap-2">
            {[
              { value: 'all', label: '전체' },
              { value: 'daily', label: '매일' },
              { value: 'weekly', label: '주간' },
              { value: 'special', label: '스페셜' }
            ].map(cat => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.value as typeof selectedCategory)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* IB 프로필 필터 */}
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value as IBProfile | 'all')}
          >
            <option value="all">모든 IB 학습자상</option>
            {Object.entries(IB_PROFILE_NAMES).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* 미션 목록 */}
        <div className="space-y-4">
          {filteredMissions.map(mission => {
            const userMission = getMissionStatus(mission.id);
            const isExpanded = expandedMission === mission.id;
            const completedSteps = userMission
              ? userMission.steps.filter(s => s.completed).length
              : 0;
            const progress = userMission
              ? (completedSteps / mission.steps.length) * 100
              : 0;

            return (
              <Card
                key={mission.id}
                className={`transition-all duration-200 ${
                  userMission?.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : userMission?.status === 'in_progress'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white'
                }`}
              >
                <CardContent className="pt-4">
                  {/* 미션 헤더 */}
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedMission(isExpanded ? null : mission.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${IB_PROFILE_COLORS[mission.ibProfile]}`}>
                        {IB_PROFILE_ICONS[mission.ibProfile]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                          {userMission?.status === 'completed' && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${DIFFICULTY_COLORS[mission.difficulty]}`}>
                            {DIFFICULTY_NAMES[mission.difficulty]}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {mission.points}점
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {mission.estimatedTime}
                          </span>
                          <span className="text-xs text-purple-600">
                            {IB_PROFILE_NAMES[mission.ibProfile]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>

                  {/* 진행률 바 */}
                  {userMission && userMission.status !== 'not_started' && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>진행률</span>
                        <span>{completedSteps}/{mission.steps.length} 완료</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            userMission.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 확장된 상세 내용 */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                      {/* 태그 */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {mission.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* 배지 정보 */}
                      {mission.badge && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                            <span className="text-lg">{mission.badge.icon}</span>
                            완료 시 "{mission.badge.name}" 배지 획득!
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">{mission.badge.description}</p>
                        </div>
                      )}

                      {/* 스텝 목록 */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">미션 단계</h4>
                        {mission.steps.map((step, idx) => {
                          const stepStatus = userMission?.steps.find(s => s.stepId === step.id);
                          const isStepCompleted = stepStatus?.completed || false;

                          return (
                            <div
                              key={step.id}
                              className={`flex items-center gap-3 p-2 rounded-lg ${
                                isStepCompleted ? 'bg-green-50' : 'bg-gray-50'
                              }`}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (userMission) toggleStep(mission.id, step.id);
                                }}
                                disabled={!userMission || userMission.status === 'completed'}
                                className="flex-shrink-0"
                              >
                                {isStepCompleted ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-300" />
                                )}
                              </button>
                              <span className={`text-sm ${isStepCompleted ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                {idx + 1}. {step.description}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* 액션 버튼 */}
                      <div className="flex gap-2 mt-4">
                        {!userMission && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              startMission(mission.id);
                            }}
                            className="flex-1 bg-orange-500 hover:bg-orange-600"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            미션 시작하기
                          </Button>
                        )}
                        {userMission?.status === 'in_progress' && (
                          <>
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                resetMission(mission.id);
                              }}
                              className="flex-1"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              초기화
                            </Button>
                          </>
                        )}
                        {userMission?.status === 'completed' && (
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              resetMission(mission.id);
                            }}
                            className="flex-1"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            다시 도전하기
                          </Button>
                        )}
                      </div>

                      {/* 완료 정보 */}
                      {userMission?.status === 'completed' && userMission.completedAt && (
                        <div className="mt-3 text-center">
                          <p className="text-sm text-green-600">
                            {new Date(userMission.completedAt).toLocaleDateString('ko-KR')}에 완료! +{userMission.earnedPoints}점 획득
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 미션 없음 */}
        {filteredMissions.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                해당하는 미션이 없습니다
              </h2>
              <p className="text-gray-500">
                다른 필터를 선택해보세요
              </p>
            </CardContent>
          </Card>
        )}

        {/* 홈으로 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
