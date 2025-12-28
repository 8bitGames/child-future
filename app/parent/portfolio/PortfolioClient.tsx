'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Calendar, Trophy, Medal, BookOpen, Camera, Sparkles, Star, TrendingUp, User, Target } from 'lucide-react';
import {
  getSelectedChildId,
  getSelectedChild,
  getChildResults,
  getChildDiary,
  getChildBadges,
  getChildMissions,
  getChildCheckIns,
} from '@/lib/utils/child-storage';

// Types
interface AssessmentResult {
  id: string;
  timestamp: string;
  basicInfo: {
    nickname: string;
    age: number;
  };
  scores: {
    creative: number;
    analytical: number;
    caring: number;
    leadership: number;
    practical: number;
  };
  ibProfiles?: string[];
}

interface DiaryEntry {
  id: string;
  date: string;
  activity: {
    title: string;
    description: string;
    photos: string[];
  };
  childReflection: string;
  parentNote?: string;
  ibProfile?: string;
  badge?: {
    name: string;
    icon: string;
  };
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold';
  earnedAt: string;
}

interface MissionProgress {
  id: string;
  missionId: string;
  status: 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
}

interface WeeklyCheckIn {
  id: string;
  weekStart: string;
  childEvaluation: {
    weeklyMood: string;
    favoriteActivity: string;
  };
}

// IB Profile 정보
const IB_PROFILES: Record<string, { emoji: string; name: string; color: string }> = {
  'Inquirer': { emoji: '🔍', name: '탐구하는 사람', color: 'bg-blue-100 text-blue-700' },
  'Knowledgeable': { emoji: '📚', name: '지식이 풍부한 사람', color: 'bg-indigo-100 text-indigo-700' },
  'Thinker': { emoji: '💭', name: '생각하는 사람', color: 'bg-purple-100 text-purple-700' },
  'Communicator': { emoji: '💬', name: '소통하는 사람', color: 'bg-pink-100 text-pink-700' },
  'Principled': { emoji: '⚖️', name: '원칙을 지키는 사람', color: 'bg-amber-100 text-amber-700' },
  'Open-minded': { emoji: '🌍', name: '열린 마음을 가진 사람', color: 'bg-teal-100 text-teal-700' },
  'Caring': { emoji: '❤️', name: '배려하는 사람', color: 'bg-rose-100 text-rose-700' },
  'Risk-taker': { emoji: '🚀', name: '도전하는 사람', color: 'bg-orange-100 text-orange-700' },
  'Balanced': { emoji: '☯️', name: '균형 잡힌 사람', color: 'bg-green-100 text-green-700' },
  'Reflective': { emoji: '🪞', name: '성찰하는 사람', color: 'bg-cyan-100 text-cyan-700' },
};

const CATEGORY_INFO: Record<string, { name: string; color: string }> = {
  creative: { name: '창의·예술', color: '#FF6B9D' },
  analytical: { name: '분석·연구', color: '#4ECDC4' },
  caring: { name: '사람·돌봄', color: '#FFE66D' },
  leadership: { name: '리더·조직', color: '#95E1D3' },
  practical: { name: '실무·기술', color: '#DDA0DD' },
};

export function PortfolioClient() {
  const router = useRouter();
  const portfolioRef = useRef<HTMLDivElement>(null);

  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState<string>('');
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [missionProgress, setMissionProgress] = useState<MissionProgress[]>([]);
  const [checkIns, setCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'3months' | '6months' | '1year' | 'all'>('3months');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Check if a child is selected
    const id = getSelectedChildId();
    if (!id) {
      router.push('/parent');
      return;
    }
    setChildId(id);

    // Get child name
    const child = getSelectedChild();
    if (child) {
      setChildName(child.nickname || child.name);
    }

    // Load all data for selected child
    const childResults = getChildResults(id);
    const childDiary = getChildDiary(id);
    const childBadges = getChildBadges(id);
    const childMissions = getChildMissions(id);
    const childCheckIns = getChildCheckIns(id);

    setResults(childResults);
    // Convert storage DiaryEntry to local DiaryEntry with defaults
    setDiaryEntries(childDiary.map(d => ({
      id: d.id,
      date: d.date || d.createdAt,
      activity: d.activity || { title: '', description: '', photos: [] },
      childReflection: d.childReflection || d.content || '',
      parentNote: d.parentNote,
      ibProfile: d.ibProfile,
      badge: d.badge
    })));
    // Convert storage Badge to local Badge with defaults
    setBadges(childBadges.map(b => ({
      id: b.id,
      name: b.name || b.title || '',
      icon: b.icon || b.emoji || '🏅',
      tier: b.tier || 'bronze',
      earnedAt: b.earnedAt
    })));
    setMissionProgress(childMissions.map(m => ({
      id: m.id,
      missionId: m.id,
      status: m.completedAt ? 'completed' as const : 'in_progress' as const,
      completedAt: m.completedAt
    })));
    setCheckIns(childCheckIns.map(c => ({
      id: c.id,
      weekStart: c.date || c.weekStart || c.createdAt,
      childEvaluation: {
        weeklyMood: c.mood || (c.childData?.weeklyMood || ''),
        favoriteActivity: c.childData?.favoriteActivity || ''
      }
    })));
  }, [router]);

  // Filter data by period
  const getFilteredData = () => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(0);
    }

    const filteredResults = results.filter(r => new Date(r.timestamp) >= startDate);
    const filteredDiary = diaryEntries.filter(d => new Date(d.date) >= startDate);
    const filteredBadges = badges.filter(b => new Date(b.earnedAt) >= startDate);
    const filteredMissions = missionProgress.filter(m =>
      m.completedAt && new Date(m.completedAt) >= startDate
    );
    const filteredCheckIns = checkIns.filter(c => new Date(c.weekStart) >= startDate);

    return {
      results: filteredResults,
      diary: filteredDiary,
      badges: filteredBadges,
      missions: filteredMissions,
      checkIns: filteredCheckIns,
    };
  };

  const filteredData = getFilteredData();
  const latestResult = results[results.length - 1];
  const completedMissions = filteredData.missions.filter(m => m.status === 'completed');

  // Calculate top categories
  const getTopCategories = () => {
    if (!latestResult) return [];
    const scores = latestResult.scores;
    return Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => key);
  };

  // Get period label
  const getPeriodLabel = () => {
    if (results.length === 0) return '기간 없음';
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        break;
      case '1year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(results[0]?.timestamp || now);
    }

    const formatDate = (date: Date) => {
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
    };

    return `${formatDate(startDate)} - ${formatDate(now)}`;
  };

  // Get representative activities from diary
  const getRepresentativeActivities = () => {
    return filteredData.diary
      .filter(entry => entry.badge || entry.ibProfile)
      .slice(0, 5)
      .map(entry => ({
        title: entry.activity.title,
        ibProfile: entry.ibProfile,
        date: entry.date,
      }));
  };

  // Get photos for gallery
  const getGalleryPhotos = () => {
    const photos: { url: string; title: string; date: string }[] = [];
    filteredData.diary.forEach(entry => {
      entry.activity.photos?.forEach(photo => {
        photos.push({
          url: photo,
          title: entry.activity.title,
          date: entry.date,
        });
      });
    });
    return photos.slice(0, 8);
  };

  // Handle PDF download
  const handlePDFDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      // Dynamic import for html2canvas and jspdf
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      if (!portfolioRef.current) return;

      const canvas = await html2canvas(portfolioRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${latestResult?.basicInfo.nickname || '아이'}_성장포트폴리오_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${latestResult?.basicInfo.nickname || '아이'}의 성장 포트폴리오`,
          text: '아이의 성장 여정을 확인해보세요!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/parent" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">검사 결과가 없습니다</h2>
            <p className="text-gray-500 mb-6">
              먼저 성향 검사를 완료하면 성장 포트폴리오를 생성할 수 있습니다.
            </p>
            <Link
              href="/parent/basic-info"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-5 h-5" />
              검사 시작하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const topCategories = getTopCategories();
  const representativeActivities = getRepresentativeActivities();
  const galleryPhotos = getGalleryPhotos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/parent" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로</span>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              title="공유하기"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handlePDFDownload}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isGeneratingPDF ? '생성 중...' : 'PDF 저장'}
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 font-medium">기간 선택:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: '3months', label: '최근 3개월' },
                { value: '6months', label: '최근 6개월' },
                { value: '1year', label: '최근 1년' },
                { value: 'all', label: '전체' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value as typeof selectedPeriod)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === option.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Content */}
        <div ref={portfolioRef} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {latestResult.basicInfo.nickname}의 성장 포트폴리오
            </h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span>{getPeriodLabel()}</span>
            </div>
          </div>

          {/* 1. Profile Summary */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              프로필 요약
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-gray-500 text-sm mb-1">이름</div>
                  <div className="text-xl font-bold text-gray-800">{latestResult.basicInfo.nickname}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm mb-1">나이</div>
                  <div className="text-xl font-bold text-gray-800">{latestResult.basicInfo.age}세</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-500 text-sm mb-1">분석 기간</div>
                  <div className="text-xl font-bold text-gray-800">{getPeriodLabel()}</div>
                </div>
              </div>

              {/* IB Profiles */}
              {latestResult.ibProfiles && latestResult.ibProfiles.length > 0 && (
                <div className="mb-4">
                  <div className="text-gray-600 text-sm mb-2">주요 IB 학습자상:</div>
                  <div className="flex flex-wrap gap-2">
                    {latestResult.ibProfiles.slice(0, 3).map((profile) => (
                      <span
                        key={profile}
                        className={`px-3 py-1 rounded-full text-sm ${IB_PROFILES[profile]?.color || 'bg-gray-100 text-gray-700'}`}
                      >
                        {IB_PROFILES[profile]?.emoji} {IB_PROFILES[profile]?.name || profile}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Categories */}
              <div>
                <div className="text-gray-600 text-sm mb-2">주요 직업군:</div>
                <div className="flex flex-wrap gap-2">
                  {topCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: `${CATEGORY_INFO[cat]?.color}30`, color: CATEGORY_INFO[cat]?.color }}
                    >
                      {CATEGORY_INFO[cat]?.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Growth Graph */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              성장 그래프
            </h2>
            {filteredData.results.length > 1 ? (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-4">
                  {Object.entries(CATEGORY_INFO).map(([key, info]) => {
                    const firstScore = filteredData.results[0]?.scores[key as keyof typeof filteredData.results[0]['scores']] || 0;
                    const lastScore = filteredData.results[filteredData.results.length - 1]?.scores[key as keyof typeof filteredData.results[0]['scores']] || 0;
                    const change = lastScore - firstScore;

                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{info.name}</span>
                          <span className={`font-bold ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            {lastScore}점 {change !== 0 && `(${change > 0 ? '+' : ''}${change})`}
                          </span>
                        </div>
                        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${lastScore}%`,
                              backgroundColor: info.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
                <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>2회 이상 검사하면 성장 추이를 확인할 수 있습니다.</p>
              </div>
            )}
          </div>

          {/* 3. Activity Highlights */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              주요 활동 하이라이트
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{completedMissions.length}개</div>
                <div className="text-gray-600 text-sm">완료한 미션</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <Medal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{filteredData.badges.length}개</div>
                <div className="text-gray-600 text-sm">획득한 배지</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{filteredData.diary.length}개</div>
                <div className="text-gray-600 text-sm">다이어리 기록</div>
              </div>
            </div>

            {/* Representative Activities */}
            {representativeActivities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">대표 활동:</h3>
                <div className="space-y-2">
                  {representativeActivities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="flex-1 text-gray-700">{activity.title}</span>
                      {activity.ibProfile && IB_PROFILES[activity.ibProfile] && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${IB_PROFILES[activity.ibProfile].color}`}>
                          {IB_PROFILES[activity.ibProfile].emoji} {IB_PROFILES[activity.ibProfile].name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Collection */}
            {filteredData.badges.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">획득한 배지:</h3>
                <div className="flex flex-wrap gap-3">
                  {filteredData.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        badge.tier === 'gold'
                          ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                          : badge.tier === 'silver'
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                          : 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800'
                      }`}
                    >
                      <span className="text-xl">{badge.icon}</span>
                      <span className="font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Photo Gallery */}
          {galleryPhotos.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-500" />
                사진 갤러리
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {galleryPhotos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-white text-xs truncate">{photo.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. AI Growth Analysis Placeholder */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI 성장 분석
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed">
                {latestResult.basicInfo.nickname}님은
                {topCategories.length > 0 && (
                  <>
                    <strong className="text-purple-600"> {CATEGORY_INFO[topCategories[0]]?.name}</strong>
                    {topCategories[1] && (
                      <>과 <strong className="text-pink-600">{CATEGORY_INFO[topCategories[1]]?.name}</strong></>
                    )}
                    영역에서 두드러진 관심과 재능을 보이고 있습니다.
                  </>
                )}
                {' '}
                {filteredData.diary.length > 0 && (
                  <>
                    지난 기간 동안 {filteredData.diary.length}개의 활동을 기록하며 꾸준히 성장하고 있습니다.
                  </>
                )}
                {' '}
                {completedMissions.length > 0 && (
                  <>
                    {completedMissions.length}개의 미션을 완료하며 다양한 경험을 쌓았습니다.
                  </>
                )}
                {' '}
                {latestResult.ibProfiles && latestResult.ibProfiles.length > 0 && (
                  <>
                    특히 <strong>{IB_PROFILES[latestResult.ibProfiles[0]]?.name || latestResult.ibProfiles[0]}</strong>의
                    특성이 잘 발달하고 있어, 앞으로도 이 방향으로 격려해 주시면 좋겠습니다.
                  </>
                )}
              </p>

              <div className="mt-4 pt-4 border-t border-purple-200">
                <Link
                  href="/parent/report"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Target className="w-4 h-4" />
                  상세 AI 분석 리포트 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/parent/report"
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-gray-700"
          >
            <Target className="w-5 h-5" />
            AI 성장 리포트
          </Link>
          <Link
            href="/parent/history"
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-gray-700"
          >
            <TrendingUp className="w-5 h-5" />
            검사 히스토리
          </Link>
        </div>
      </div>
    </div>
  );
}
