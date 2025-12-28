'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLatestResult } from '@/lib/utils/storage';
import { AssessmentResult, IBProfile, IB_PROFILE_NAMES } from '@/lib/types/result';
import {
  CONVERSATION_CARDS,
  SITUATION_INFO,
  ConversationCard,
  ConversationHistory,
  Situation,
  getFilteredCards,
  getRandomCard,
  getUnusedCards
} from '@/lib/data/conversation-cards';
import {
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  Check,
  Heart,
  Lightbulb,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Compass,
  BookOpen,
  Brain,
  Users,
  Shield,
  Zap,
  Scale,
  Sparkles
} from 'lucide-react';

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

export default function ConversationPage() {
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [selectedSituation, setSelectedSituation] = useState<Situation | 'all'>('all');
  const [selectedProfile, setSelectedProfile] = useState<IBProfile | 'all'>('all');
  const [currentCard, setCurrentCard] = useState<ConversationCard | null>(null);
  const [history, setHistory] = useState<ConversationHistory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [usedToday, setUsedToday] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = getLatestResult();
    setLatestResult(result);

    // localStorage에서 데이터 불러오기
    const savedHistory = localStorage.getItem('conversationHistory');
    const savedFavorites = localStorage.getItem('conversationFavorites');
    const savedUsedToday = localStorage.getItem('conversationUsedToday');
    const savedDate = localStorage.getItem('conversationDate');

    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    // 오늘 날짜 체크
    const today = new Date().toDateString();
    if (savedDate !== today) {
      // 새로운 날이면 오늘 사용 기록 초기화
      localStorage.setItem('conversationDate', today);
      localStorage.setItem('conversationUsedToday', JSON.stringify([]));
      setUsedToday([]);
    } else if (savedUsedToday) {
      setUsedToday(JSON.parse(savedUsedToday));
    }

    setLoading(false);
  }, []);

  // 필터링된 카드 가져오기
  const getAvailableCards = () => {
    let cards = CONVERSATION_CARDS;

    // 상황 필터
    if (selectedSituation !== 'all') {
      cards = cards.filter(c => c.situation === selectedSituation);
    }

    // IB 프로필 필터
    if (selectedProfile !== 'all') {
      cards = cards.filter(c => c.targetIBProfile === selectedProfile);
    }

    return cards;
  };

  // 새 카드 추천
  const refreshCard = () => {
    const available = getAvailableCards();
    // 오늘 사용하지 않은 카드 우선
    const unused = available.filter(c => !usedToday.includes(c.id));
    const pool = unused.length > 0 ? unused : available;
    const newCard = getRandomCard(pool);
    setCurrentCard(newCard);
    setShowTips(false);
  };

  // 첫 카드 로드
  useEffect(() => {
    if (!loading && !currentCard) {
      refreshCard();
    }
  }, [loading, selectedSituation, selectedProfile]);

  // 카드 사용 표시
  const markAsUsed = () => {
    if (!currentCard) return;

    const newHistory: ConversationHistory = {
      id: `${Date.now()}`,
      cardId: currentCard.id,
      usedAt: new Date().toISOString()
    };

    const updatedHistory = [newHistory, ...history];
    const updatedUsedToday = [...usedToday, currentCard.id];

    setHistory(updatedHistory);
    setUsedToday(updatedUsedToday);

    localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('conversationUsedToday', JSON.stringify(updatedUsedToday));

    // 다음 카드로
    refreshCard();
  };

  // 즐겨찾기 토글
  const toggleFavorite = (cardId: string) => {
    const updated = favorites.includes(cardId)
      ? favorites.filter(id => id !== cardId)
      : [...favorites, cardId];

    setFavorites(updated);
    localStorage.setItem('conversationFavorites', JSON.stringify(updated));
  };

  // 추천 IB 프로필 (결과 기반)
  const recommendedProfiles = latestResult
    ? latestResult.ibProfiles.slice(0, 3)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
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
                <MessageCircle className="h-7 w-7 text-pink-600" />
                대화 카드
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                아이와 함께 나누는 의미 있는 대화
              </p>
            </div>
          </div>
        </div>

        {/* 오늘의 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-pink-100 to-rose-100 border-pink-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-200 rounded-full">
                  <Check className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-pink-700">오늘 나눈 대화</p>
                  <p className="text-2xl font-bold text-pink-800">{usedToday.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-100 to-indigo-100 border-purple-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-200 rounded-full">
                  <Bookmark className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-700">즐겨찾기</p>
                  <p className="text-2xl font-bold text-purple-800">{favorites.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 상황 선택 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              지금 어떤 상황인가요?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSituation === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedSituation('all');
                  setCurrentCard(null);
                }}
                className={selectedSituation === 'all' ? 'bg-pink-500 hover:bg-pink-600' : ''}
              >
                전체
              </Button>
              {Object.entries(SITUATION_INFO).map(([key, info]) => (
                <Button
                  key={key}
                  variant={selectedSituation === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedSituation(key as Situation);
                    setCurrentCard(null);
                  }}
                  className={selectedSituation === key ? 'bg-pink-500 hover:bg-pink-600' : ''}
                >
                  {info.emoji} {info.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* IB 프로필 필터 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gray-600" />
              강화하고 싶은 IB 학습자상
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedProfile === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedProfile('all');
                  setCurrentCard(null);
                }}
                className={selectedProfile === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
              >
                전체
              </Button>
              {Object.entries(IB_PROFILE_NAMES).map(([key, name]) => {
                const isRecommended = recommendedProfiles.includes(key as IBProfile);
                return (
                  <Button
                    key={key}
                    variant={selectedProfile === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedProfile(key as IBProfile);
                      setCurrentCard(null);
                    }}
                    className={`
                      ${selectedProfile === key ? 'bg-purple-500 hover:bg-purple-600' : ''}
                      ${isRecommended && selectedProfile !== key ? 'border-purple-400 border-2' : ''}
                    `}
                  >
                    {IB_PROFILE_ICONS[key as IBProfile]}
                    <span className="ml-1">{name}</span>
                    {isRecommended && <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />}
                  </Button>
                );
              })}
            </div>
            {recommendedProfiles.length > 0 && (
              <p className="text-xs text-purple-600 mt-2">
                <Star className="h-3 w-3 inline fill-yellow-400 text-yellow-400" /> 표시는 {latestResult?.basicInfo.nickname}님에게 추천하는 학습자상입니다
              </p>
            )}
          </CardContent>
        </Card>

        {/* 현재 카드 */}
        {currentCard && (
          <Card className="mb-6 bg-white shadow-lg border-2 border-pink-200">
            <CardContent className="pt-6">
              {/* 카드 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`p-2 rounded-lg ${IB_PROFILE_COLORS[currentCard.targetIBProfile]}`}>
                    {IB_PROFILE_ICONS[currentCard.targetIBProfile]}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {IB_PROFILE_NAMES[currentCard.targetIBProfile]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {SITUATION_INFO[currentCard.situation].emoji} {SITUATION_INFO[currentCard.situation].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(currentCard.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {favorites.includes(currentCard.id) ? (
                    <BookmarkCheck className="h-6 w-6 text-purple-500 fill-purple-500" />
                  ) : (
                    <Bookmark className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>

              {/* 질문 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-4">
                <p className="text-xl md:text-2xl font-medium text-gray-900 text-center leading-relaxed">
                  "{currentCard.question}"
                </p>
              </div>

              {/* 대화 팁 */}
              <div className="mb-4">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Lightbulb className="h-5 w-5" />
                  대화 팁 보기
                  <ChevronRight className={`h-4 w-4 transition-transform ${showTips ? 'rotate-90' : ''}`} />
                </button>

                {showTips && (
                  <div className="mt-3 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700 mb-2 font-medium">
                      아이가 답하면 이렇게 이어가보세요:
                    </p>
                    <ul className="space-y-2">
                      {currentCard.followUpTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-purple-600">
                          <span className="text-purple-400">→</span>
                          "{tip}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={refreshCard}
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  다른 질문
                </Button>
                <Button
                  onClick={markAsUsed}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  <Check className="h-4 w-4 mr-2" />
                  오늘 사용했어요
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 즐겨찾기 목록 */}
        {favorites.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookmarkCheck className="h-5 w-5 text-purple-500" />
                즐겨찾기한 질문
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {favorites.slice(0, 5).map(cardId => {
                  const card = CONVERSATION_CARDS.find(c => c.id === cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={cardId}
                      onClick={() => setCurrentCard(card)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded ${IB_PROFILE_COLORS[card.targetIBProfile]}`}>
                          {IB_PROFILE_ICONS[card.targetIBProfile]}
                        </span>
                        <p className="text-sm text-gray-700 flex-1">"{card.question}"</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(cardId);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <BookmarkCheck className="h-4 w-4 text-purple-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {favorites.length > 5 && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  +{favorites.length - 5}개 더 있습니다
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* 최근 사용 기록 */}
        {history.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                최근 나눈 대화
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.slice(0, 5).map(item => {
                  const card = CONVERSATION_CARDS.find(c => c.id === item.cardId);
                  if (!card) return null;
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded ${IB_PROFILE_COLORS[card.targetIBProfile]}`}>
                          {IB_PROFILE_ICONS[card.targetIBProfile]}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">"{card.question}"</p>
                          <p className="text-xs text-gray-400">
                            {new Date(item.usedAt).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 카드 없음 */}
        {!currentCard && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                해당하는 대화 카드가 없습니다
              </h2>
              <p className="text-gray-500 mb-4">
                다른 필터를 선택해보세요
              </p>
              <Button
                onClick={() => {
                  setSelectedSituation('all');
                  setSelectedProfile('all');
                }}
                variant="outline"
              >
                필터 초기화
              </Button>
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
