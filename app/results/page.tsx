'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssessmentResult, CategoryScores } from '@/lib/types/result';
import { AssessmentData, CAREER_CATEGORY_NAMES, AssessmentMode } from '@/lib/types/assessment';
import { calculateScores, getTopCategories } from '@/lib/utils/scoring';
import { saveResult } from '@/lib/utils/storage';
import { getTopJobs } from '@/lib/data/careers';
import { getTopMajors } from '@/lib/data/majors';
import { CONSULTATION_GUIDES } from '@/lib/data/consultation';
import { IB_PROFILE_NAMES } from '@/lib/types/result';
import { THEORY_SOURCES } from '@/lib/data/theories';
import { IB_SOURCE, getIBProfileDefinition } from '@/lib/data/ib-profiles';
import { User, GraduationCap, Heart, Star, Info } from 'lucide-react';
import {
  Sparkles,
  Bot,
  Zap,
  Lightbulb,
  Trophy,
  Medal,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  ArrowRight,
  ClipboardList,
  MessageCircle,
  Download
} from 'lucide-react';
import html2canvas from 'html2canvas';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultationMode, setSelectedConsultationMode] = useState<string | null>(null);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  // 이미지로 저장
  const handleSaveAsImage = async () => {
    if (!resultRef.current || !result) return;

    setIsSaving(true);
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f9fafb',
        logging: false
      });

      const link = document.createElement('a');
      link.download = `${result.basicInfo.nickname}_진로탐색결과_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function analyzeResults() {
      try {
        // sessionStorage에서 데이터 수집
        const basicInfoStr = sessionStorage.getItem('basicInfo');
        const consultationStr = sessionStorage.getItem('consultation');
        const responsesStr = sessionStorage.getItem('responses');

        if (!basicInfoStr || !consultationStr || !responsesStr) {
          router.push('/basic-info');
          return;
        }

        const basicInfo = JSON.parse(basicInfoStr);
        const consultation = JSON.parse(consultationStr);
        const responses = JSON.parse(responsesStr);

        // 모드 확인
        const mode = sessionStorage.getItem('assessmentMode') as AssessmentMode || 'full';
        const quickMode = mode === 'quick';
        setIsQuickMode(quickMode);

        // 점수 계산
        const scores = calculateScores(responses);
        const topCategories = getTopCategories(scores, quickMode ? 2 : 3);

        // Gemini API 호출
        const data: AssessmentData = {
          basicInfo,
          consultation,
          responses,
          timestamp: new Date().toISOString()
        };

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data, mode })
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const analysisResult = await response.json();

        // 직업 및 전공 추천
        const jobs = topCategories.flatMap(category => getTopJobs(category, 3));
        const majors = topCategories.flatMap(category => getTopMajors(category, 2));

        // 최종 결과 생성
        const completeResult: AssessmentResult = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          basicInfo,
          scores,
          topCategories,
          jobs,
          majors,
          ibProfiles: analysisResult.data?.ibProfiles || ['Balanced'],
          aiInsights: analysisResult.data?.aiInsights || '분석이 완료되었습니다.',
          developmentTips: analysisResult.data?.developmentTips || ''
        };

        // localStorage에 저장
        saveResult(completeResult);
        setResult(completeResult);
        setLoading(false);

        // sessionStorage 정리 (quick 모드면 확장용 데이터 유지)
        if (!quickMode) {
          sessionStorage.clear();
        } else {
          // quick 모드: responses만 정리, basicInfo/consultation/quickResponses 유지
          sessionStorage.removeItem('responses');
        }

      } catch (error) {
        console.error('Analysis error:', error);
        setError('결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        setLoading(false);
      }
    }

    analyzeResults();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI가 분석 중입니다...</h2>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">오류 발생</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link href="/">
                <Button>처음으로 돌아가기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  const maxScore = Math.max(...Object.values(result.scores));

  // 정밀검사로 확장하기
  const handleExtend = () => {
    // 기존 데이터 유지하면서 extend 모드로 전환
    sessionStorage.setItem('assessmentMode', 'extend');
    router.push('/assessment');
  };

  // 메달 아이콘 렌더링 함수
  const renderMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return null;
  };

  // 간소화 결과 렌더링
  if (isQuickMode) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto" />
            <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-900">
              {result.basicInfo.nickname}님의 빠른 검사 결과
            </h1>
            <p className="text-gray-500 text-sm">
              {new Date(result.timestamp).toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* AI 요약 */}
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                <p className="text-gray-700">{result.aiInsights}</p>
              </div>
            </CardContent>
          </Card>

          {/* 상위 2개 직업군 */}
          <div className="space-y-4 mb-6">
            {result.topCategories.slice(0, 2).map((category, index) => (
              <Card key={category} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    {renderMedalIcon(index)}
                    <h3 className="text-lg font-bold text-gray-900">
                      {CAREER_CATEGORY_NAMES[category]}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.jobs
                      .filter(j => j.category === category)
                      .slice(0, 3)
                      .map(job => (
                        <span
                          key={job.title}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {job.icon} {job.title}
                        </span>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* IB 학습자상 */}
          <Card className="mb-8 bg-gray-50">
            <CardContent className="pt-6">
              <p className="text-gray-700 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">IB 학습자상:</span>{' '}
                {result.ibProfiles.map(profile => IB_PROFILE_NAMES[profile]).join(', ')}
              </p>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <Button
              variant="default"
              className="w-full py-4"
              onClick={handleExtend}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              정밀검사로 확장하기 (+14문항)
            </Button>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                새로운 검사 시작
              </Button>
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            정밀검사에서는 상세 분석, 전공 추천, 상담 가이드를 확인할 수 있어요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div ref={resultRef} className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Sparkles className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            {result.basicInfo.nickname}님의 진로 탐색 결과
          </h1>
          <p className="text-gray-600">
            {new Date(result.timestamp).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* AI 인사이트 */}
        <Card className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Bot className="h-10 w-10 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">AI 분석</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {result.aiInsights}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 아이 정보 요약 */}
        <Card className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-start gap-2">
              <User className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <span>{result.basicInfo.nickname}님의 프로필 요약</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 기본 정보 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  기본 정보
                </h3>
                <div className="bg-white p-4 rounded-lg border space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">나이:</span> {result.basicInfo.age}세
                    {result.basicInfo.grade && ` (${result.basicInfo.grade})`}
                  </p>
                  {result.basicInfo.gender && (
                    <p className="text-gray-700">
                      <span className="font-medium">성별:</span> {result.basicInfo.gender === 'male' ? '남자' : result.basicInfo.gender === 'female' ? '여자' : result.basicInfo.gender}
                    </p>
                  )}
                </div>
              </div>

              {/* 활동 & 취미 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  활동 & 취미
                </h3>
                <div className="bg-white p-4 rounded-lg border space-y-2">
                  {result.basicInfo.activities.length > 0 && (
                    <p className="text-gray-700">
                      <span className="font-medium">활동:</span>{' '}
                      {result.basicInfo.activities.join(', ')}
                    </p>
                  )}
                  {result.basicInfo.hobbies.length > 0 && (
                    <p className="text-gray-700">
                      <span className="font-medium">취미:</span>{' '}
                      {result.basicInfo.hobbies.join(', ')}
                    </p>
                  )}
                  {result.basicInfo.interests.length > 0 && (
                    <p className="text-gray-700">
                      <span className="font-medium">관심사:</span>{' '}
                      {result.basicInfo.interests.join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* 잘하는 과목 */}
              {result.basicInfo.strongSubjects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    잘하는 과목
                  </h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex flex-wrap gap-2">
                      {result.basicInfo.strongSubjects.map((subject) => (
                        <span
                          key={subject}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 특별한 경험 */}
              {result.basicInfo.achievements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    특별한 경험
                  </h3>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex flex-wrap gap-2">
                      {result.basicInfo.achievements.map((achievement) => (
                        <span
                          key={achievement}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 상세 입력 안내 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 flex items-start gap-2">
                <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>더 정확한 분석을 원하시나요?</strong> 아이의 활동, 취미, 관심사, 특별한 경험 등을
                  더 상세하게 입력하실수록 AI가 더욱 맞춤화된 진로 분석과 교육 가이드를 제공해드립니다.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 직업군 점수 */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">직업군별 점수</h2>
            <p className="text-sm text-gray-600 mb-6">
              성향 검사 응답을 바탕으로 5가지 직업군에 대한 적합도를 분석한 결과입니다.
              점수가 높을수록 해당 분야에 대한 관심과 적성이 높다는 것을 의미합니다.
            </p>
            <div className="space-y-4">
              {Object.entries(result.scores)
                .sort((a, b) => b[1] - a[1])
                .map(([category, score], index) => {
                  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                  const isTop = index < 3;

                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {index < 3 && renderMedalIcon(index)}
                          <span className={`font-semibold ${isTop ? 'text-lg text-gray-900' : 'text-base text-gray-700'}`}>
                            {CAREER_CATEGORY_NAMES[category as keyof CategoryScores]}
                          </span>
                        </div>
                        <span className={`font-bold ${isTop ? 'text-lg text-blue-600' : 'text-gray-700'}`}>
                          {score}점
                        </span>
                      </div>
                      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all duration-500 rounded-full ${
                            isTop ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* 상위 직업군 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {result.topCategories.map((category, index) => (
            <Card key={category} className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  {renderMedalIcon(index)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {CAREER_CATEGORY_NAMES[category]}
                    </h3>
                    <p className="text-sm text-gray-700">점수: {result.scores[category]}</p>
                  </div>
                </div>

                {/* 대표 직업 */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-700">대표 직업</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.jobs
                      .filter(j => j.category === category)
                      .slice(0, 5)
                      .map(job => (
                        <span
                          key={job.title}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {job.icon} {job.title}
                        </span>
                      ))}
                  </div>
                </div>

                {/* 관련 전공 */}
                <div>
                  <h4 className="font-semibold mb-2 text-gray-700">관련 전공</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.majors
                      .filter(m => m.category === category)
                      .slice(0, 4)
                      .map(major => (
                        <span
                          key={major.name}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {major.name}
                        </span>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 발전 팁 */}
        {result.developmentTips && (
          <Card className="mb-12 bg-yellow-50 border-2 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-10 w-10 text-yellow-500 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3 text-gray-900">재능 발전 팁</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {result.developmentTips}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* IB 학습자상 상세 */}
        <Card className="mb-12 border-2 border-purple-200">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-start gap-2">
              <BookOpen className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <span>IB 학습자상 맞춤 교육 가이드</span>
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {result.basicInfo.nickname}님은{' '}
              <strong className="text-purple-600">
                {result.ibProfiles.map(profile => IB_PROFILE_NAMES[profile]).join(', ')}
              </strong>
              의 특징이 강합니다.
            </p>

            <div className="space-y-8">
              {result.ibProfiles.map((profileId) => {
                const profile = getIBProfileDefinition(profileId);
                if (!profile) return null;

                return (
                  <div key={profileId} className="bg-purple-50 rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-3xl flex-shrink-0">{profile.icon}</span>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-gray-900">
                          {profile.nameKo} ({profile.nameEn})
                        </h3>
                        <p className="text-sm text-gray-600">{profile.definition}</p>
                      </div>
                    </div>

                    {/* 특성 */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">주요 특성</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.characteristics.map((char, i) => (
                          <span key={i} className="px-3 py-1 bg-white text-purple-700 rounded-full text-sm border border-purple-200">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 교육 방법 탭 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 부모 가이드 */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          부모님을 위한 가이드
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {profile.educationMethods.parentGuide.map((guide, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {guide}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 선생님 가이드 */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          선생님을 위한 가이드
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {profile.educationMethods.teacherGuide.map((guide, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {guide}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 추천 활동 */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          추천 활동
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {profile.educationMethods.activities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 피해야 할 행동 */}
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          피해야 할 행동
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {profile.educationMethods.avoidBehaviors.map((behavior, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              {behavior}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>IB 학습자상이란?</strong> International Baccalaureate에서 정의한 10가지 학습자 특성으로,
                전 세계 IB 학교에서 학생들의 전인적 성장을 위해 활용하고 있습니다.
                각 특성에 맞는 교육 방법을 적용하면 아이의 잠재력을 더욱 효과적으로 발현시킬 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 검사 근거 */}
        <Card className="mb-12 bg-gray-50">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              검사의 이론적 근거
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Holland 이론 */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{THEORY_SOURCES.holland.name}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {THEORY_SOURCES.holland.author} ({THEORY_SOURCES.holland.year})
                </p>
                <p className="text-sm text-gray-700 mb-3">{THEORY_SOURCES.holland.description}</p>
                <div className="text-xs text-gray-600">
                  <p className="font-semibold mb-1">출처:</p>
                  {THEORY_SOURCES.holland.koreanSources.map((source, i) => (
                    <p key={i}>• {source.name} ({source.organization})</p>
                  ))}
                </div>
              </div>

              {/* IB 학습자상 */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-bold text-lg mb-2 text-gray-900">IB 학습자상</h3>
                <p className="text-sm text-gray-700 mb-2">{IB_SOURCE.organization}</p>
                <p className="text-sm text-gray-700 mb-3">{IB_SOURCE.description}</p>
                <div className="text-xs text-gray-600">
                  <p className="font-semibold mb-1">출처:</p>
                  <p>• {IB_SOURCE.document}</p>
                  <a
                    href={IB_SOURCE.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    공식 사이트 <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center">
              * 본 검사는 학술적 이론을 바탕으로 AI가 종합 분석한 결과이며, 전문 상담사의 조언을 대체하지 않습니다.
            </p>
          </CardContent>
        </Card>

        {/* 상담 가이드 */}
        <Card className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">상담 모드별 가이드</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {Object.entries(CONSULTATION_GUIDES).map(([mode, guide]) => (
                <Button
                  key={mode}
                  variant={selectedConsultationMode === mode ? 'default' : 'outline'}
                  onClick={() => setSelectedConsultationMode(mode)}
                  className="text-sm"
                >
                  {guide.title.split(' ')[0]}
                </Button>
              ))}
            </div>

            {selectedConsultationMode && (
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2 text-gray-900">{CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].title}</h3>
                <p className="text-gray-700 mb-4">{CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].description}</p>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    상담 팁
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    예시 문장
                  </h4>
                  <ul className="space-y-2">
                    {CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].exampleQuestions.map((question, i) => (
                      <li key={i} className="bg-white p-3 rounded-lg border border-gray-200 text-gray-700">
                        "{question}"
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              새로운 검사 시작하기
            </Button>
          </Link>
          <Button
            variant="default"
            className="w-full flex-1"
            onClick={handleSaveAsImage}
            disabled={isSaving}
          >
            <Download className="h-4 w-4 mr-2" />
            {isSaving ? '저장 중...' : '이미지로 저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
