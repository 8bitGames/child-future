'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Calendar,
  Trophy,
  Medal,
  BookOpen,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Target,
  Star,
  Heart,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Activity,
  Brain,
  Loader2,
} from 'lucide-react';

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
  };
  ibProfile?: string;
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
    activityLevel: string;
  };
  parentObservation: {
    noticeableChanges: string;
    completedActivities: string[];
  };
}

interface GrowthReport {
  summary: string;
  strengths: string[];
  growthAreas: string[];
  recommendations: string[];
  parentTips: string[];
  generatedAt: string;
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

const CATEGORY_INFO: Record<string, { name: string; color: string; emoji: string }> = {
  creative: { name: '창의·예술', color: '#FF6B9D', emoji: '🎨' },
  analytical: { name: '분석·연구', color: '#4ECDC4', emoji: '🔬' },
  caring: { name: '사람·돌봄', color: '#FFE66D', emoji: '🤝' },
  leadership: { name: '리더·조직', color: '#95E1D3', emoji: '👑' },
  practical: { name: '실무·기술', color: '#DDA0DD', emoji: '🔧' },
};

export function ReportClient() {
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [missionProgress, setMissionProgress] = useState<MissionProgress[]>([]);
  const [checkIns, setCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('quarterly');
  const [report, setReport] = useState<GrowthReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load all data from localStorage
    const savedResults = localStorage.getItem('child-future-results');
    const savedDiary = localStorage.getItem('child-future-diary');
    const savedBadges = localStorage.getItem('child-future-badges');
    const savedMissions = localStorage.getItem('child-future-mission-progress');
    const savedCheckIns = localStorage.getItem('child-future-checkins');
    const savedReport = localStorage.getItem('child-future-reports');

    if (savedResults) setResults(JSON.parse(savedResults));
    if (savedDiary) setDiaryEntries(JSON.parse(savedDiary));
    if (savedBadges) setBadges(JSON.parse(savedBadges));
    if (savedMissions) setMissionProgress(JSON.parse(savedMissions));
    if (savedCheckIns) setCheckIns(JSON.parse(savedCheckIns));
    if (savedReport) {
      const reports = JSON.parse(savedReport);
      if (reports.length > 0) {
        setReport(reports[reports.length - 1]);
      }
    }
  }, []);

  // Filter data by period
  const getFilteredData = useCallback(() => {
    const now = new Date();
    let startDate: Date;

    switch (selectedPeriod) {
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarterly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
    }

    return {
      results: results.filter(r => new Date(r.timestamp) >= startDate),
      diary: diaryEntries.filter(d => new Date(d.date) >= startDate),
      badges: badges.filter(b => new Date(b.earnedAt) >= startDate),
      missions: missionProgress.filter(m => m.completedAt && new Date(m.completedAt) >= startDate),
      checkIns: checkIns.filter(c => new Date(c.weekStart) >= startDate),
    };
  }, [results, diaryEntries, badges, missionProgress, checkIns, selectedPeriod]);

  const filteredData = getFilteredData();
  const latestResult = results[results.length - 1];
  const previousResult = filteredData.results.length > 1 ? filteredData.results[0] : null;
  const completedMissions = filteredData.missions.filter(m => m.status === 'completed');

  // Calculate score changes
  const getScoreChanges = () => {
    if (!latestResult || !previousResult) return [];

    const changes: { category: string; previous: number; current: number; change: number }[] = [];

    Object.keys(CATEGORY_INFO).forEach((key) => {
      const cat = key as keyof typeof latestResult.scores;
      changes.push({
        category: key,
        previous: previousResult.scores[cat],
        current: latestResult.scores[cat],
        change: latestResult.scores[cat] - previousResult.scores[cat],
      });
    });

    return changes.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  };

  // Get most active IB profile from diary
  const getMostActiveIBProfile = () => {
    const profileCounts: Record<string, number> = {};
    filteredData.diary.forEach((entry) => {
      if (entry.ibProfile) {
        profileCounts[entry.ibProfile] = (profileCounts[entry.ibProfile] || 0) + 1;
      }
    });

    const sorted = Object.entries(profileCounts).sort(([, a], [, b]) => b - a);
    return sorted[0]?.[0] || null;
  };

  // Calculate consistency score (based on weekly check-ins)
  const getConsistencyScore = () => {
    const now = new Date();
    let expectedCheckIns = 0;

    switch (selectedPeriod) {
      case 'monthly':
        expectedCheckIns = 4;
        break;
      case 'quarterly':
        expectedCheckIns = 12;
        break;
      case 'yearly':
        expectedCheckIns = 52;
        break;
    }

    const actualCheckIns = filteredData.checkIns.length;
    return Math.min(100, Math.round((actualCheckIns / expectedCheckIns) * 100));
  };

  // Generate AI report
  const generateReport = async () => {
    if (!latestResult) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childInfo: {
            nickname: latestResult.basicInfo.nickname,
            age: latestResult.basicInfo.age,
          },
          period: selectedPeriod,
          assessmentComparison: previousResult
            ? {
                previous: previousResult,
                current: latestResult,
              }
            : { current: latestResult },
          activityStats: {
            totalMissionsCompleted: completedMissions.length,
            totalBadgesEarned: filteredData.badges.length,
            totalDiaryEntries: filteredData.diary.length,
            totalCheckIns: filteredData.checkIns.length,
            mostActiveIBProfile: getMostActiveIBProfile(),
            consistencyScore: getConsistencyScore(),
          },
          parentObservations: filteredData.checkIns
            .map((c) => c.parentObservation?.noticeableChanges)
            .filter(Boolean)
            .join(' '),
        }),
      });

      if (!response.ok) {
        throw new Error('리포트 생성에 실패했습니다.');
      }

      const data = await response.json();
      const newReport: GrowthReport = {
        ...data,
        generatedAt: new Date().toISOString(),
      };

      setReport(newReport);

      // Save to localStorage
      const savedReports = JSON.parse(localStorage.getItem('child-future-reports') || '[]');
      savedReports.push(newReport);
      localStorage.setItem('child-future-reports', JSON.stringify(savedReports));
    } catch (err) {
      console.error('Report generation error:', err);
      setError('리포트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');

      // Fallback to local generation if API fails
      generateLocalReport();
    } finally {
      setIsGenerating(false);
    }
  };

  // Local fallback report generation
  const generateLocalReport = () => {
    if (!latestResult) return;

    const scoreChanges = getScoreChanges();
    const topCategories = Object.entries(latestResult.scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => key);

    const mostActiveProfile = getMostActiveIBProfile();
    const consistencyScore = getConsistencyScore();

    const localReport: GrowthReport = {
      summary: `${latestResult.basicInfo.nickname}님은 지난 ${
        selectedPeriod === 'monthly' ? '한 달' : selectedPeriod === 'quarterly' ? '세 달' : '일 년'
      }간 꾸준히 성장해왔습니다. ${CATEGORY_INFO[topCategories[0]]?.name} 영역에서 특히 두드러진 관심을 보이고 있으며, ${
        completedMissions.length > 0 ? `${completedMissions.length}개의 미션을 완료하며 다양한 경험을 쌓았습니다.` : '새로운 활동에 도전할 준비가 되어 있습니다.'
      }`,
      strengths: [
        `${CATEGORY_INFO[topCategories[0]]?.name} 분야에 대한 높은 관심과 재능`,
        mostActiveProfile ? `${IB_PROFILES[mostActiveProfile]?.name} 성향의 발달` : '다양한 활동에 대한 호기심',
        filteredData.diary.length > 0 ? '활동을 기록하고 성찰하는 습관' : '새로운 것을 배우려는 열정',
      ],
      growthAreas: scoreChanges
        .filter((c) => c.change > 0)
        .slice(0, 2)
        .map((c) => `${CATEGORY_INFO[c.category]?.name} 영역 ${c.change}점 상승`),
      recommendations: [
        topCategories[0] && `${CATEGORY_INFO[topCategories[0]]?.name} 관련 활동을 더 탐색해보세요`,
        '매주 새로운 미션에 도전해보세요',
        '가족과 함께하는 대화 시간을 늘려보세요',
      ].filter(Boolean) as string[],
      parentTips: [
        '아이의 관심사를 존중하고 격려해주세요',
        `${mostActiveProfile ? IB_PROFILES[mostActiveProfile]?.name + '의 특성을 발전시킬 수 있는 활동을 제공해주세요' : '다양한 경험을 할 수 있는 기회를 만들어주세요'}`,
      ],
      generatedAt: new Date().toISOString(),
    };

    setReport(localReport);
    setError(null);
  };

  // Handle PDF download
  const handlePDFDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const reportElement = document.getElementById('report-content');
      if (!reportElement) return;

      const canvas = await html2canvas(reportElement, {
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
      pdf.save(`${latestResult?.basicInfo.nickname || '아이'}_성장리포트_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    }
  };

  const scoreChanges = getScoreChanges();
  const mostActiveProfile = getMostActiveIBProfile();
  const consistencyScore = getConsistencyScore();

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">검사 결과가 없습니다</h2>
            <p className="text-gray-500 mb-6">
              먼저 성향 검사를 완료하면 AI 성장 분석 리포트를 생성할 수 있습니다.
            </p>
            <Link
              href="/basic-info"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>홈으로</span>
          </Link>
          {report && (
            <button
              onClick={handlePDFDownload}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-5 h-5" />
              PDF 저장
            </button>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Brain className="w-8 h-8 text-purple-500" />
            AI 성장 분석 리포트
          </h1>
          <p className="text-gray-600">
            {latestResult.basicInfo.nickname}님의 성장 여정을 AI가 분석해드립니다
          </p>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              분석 기간:
            </span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'monthly', label: '월간 리포트' },
                { value: 'quarterly', label: '분기 리포트' },
                { value: 'yearly', label: '연간 리포트' },
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

        {/* Report Content */}
        <div id="report-content" className="space-y-6">
          {/* Assessment Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              검사 결과 비교
            </h2>

            {previousResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">이전 검사</div>
                    <div className="font-medium text-gray-700">
                      {new Date(previousResult.timestamp).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm text-purple-500 mb-1">최근 검사</div>
                    <div className="font-medium text-purple-700">
                      {new Date(latestResult.timestamp).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {scoreChanges.map((change) => (
                    <div key={change.category} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-gray-600 flex items-center gap-1">
                        <span>{CATEGORY_INFO[change.category]?.emoji}</span>
                        {CATEGORY_INFO[change.category]?.name}
                      </div>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${change.current}%`,
                            backgroundColor: CATEGORY_INFO[change.category]?.color,
                          }}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <span className="font-bold text-gray-800">{change.current}</span>
                        <span
                          className={`ml-2 text-sm font-medium ${
                            change.change > 0
                              ? 'text-green-600'
                              : change.change < 0
                              ? 'text-red-600'
                              : 'text-gray-400'
                          }`}
                        >
                          {change.change > 0 ? '+' : ''}
                          {change.change !== 0 ? change.change : '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>2회 이상 검사하면 결과 비교를 확인할 수 있습니다.</p>
              </div>
            )}
          </div>

          {/* Activity Statistics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              활동 통계
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{completedMissions.length}</div>
                <div className="text-gray-600 text-sm">완료 미션</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <Medal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{filteredData.badges.length}</div>
                <div className="text-gray-600 text-sm">획득 배지</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{filteredData.diary.length}</div>
                <div className="text-gray-600 text-sm">다이어리</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{filteredData.checkIns.length}</div>
                <div className="text-gray-600 text-sm">주간 체크인</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Most Active IB Profile */}
              {mostActiveProfile && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-2">가장 활발한 IB 학습자상</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${IB_PROFILES[mostActiveProfile]?.color}`}>
                    <span className="text-xl">{IB_PROFILES[mostActiveProfile]?.emoji}</span>
                    <span className="font-medium">{IB_PROFILES[mostActiveProfile]?.name}</span>
                  </div>
                </div>
              )}

              {/* Consistency Score */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-2">꾸준함 점수</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${consistencyScore}%` }}
                    />
                  </div>
                  <span className="font-bold text-purple-600">{consistencyScore}점</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI 성장 분석
              </h2>
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    {report ? '다시 분석' : '분석 시작'}
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 rounded-xl text-red-600 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {report ? (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    전체 요약
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{report.summary}</p>
                </div>

                {/* Strengths */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    강점
                  </h3>
                  <div className="space-y-2">
                    {report.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Areas */}
                {report.growthAreas.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      성장한 영역
                    </h3>
                    <div className="space-y-2">
                      {report.growthAreas.map((area, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-500" />
                    추천 활동
                  </h3>
                  <div className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Parent Tips */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    부모님을 위한 팁
                  </h3>
                  <div className="space-y-2">
                    {report.parentTips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
                        <Heart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generated At */}
                <div className="text-center text-sm text-gray-400">
                  생성일: {new Date(report.generatedAt).toLocaleString('ko-KR')}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  AI가 {latestResult.basicInfo.nickname}님의 성장 데이터를 분석하여
                  <br />
                  맞춤형 리포트를 생성합니다.
                </p>
                <button
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      분석 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      AI 분석 시작하기
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/portfolio"
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-gray-700"
          >
            <BookOpen className="w-5 h-5" />
            성장 포트폴리오
          </Link>
          <Link
            href="/history"
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
