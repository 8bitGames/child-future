'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AssessmentResult, CategoryScores } from '@/lib/types/result';
import { AssessmentData, CAREER_CATEGORY_NAMES } from '@/lib/types/assessment';
import { calculateScores, getTopCategories } from '@/lib/utils/scoring';
import { saveResult } from '@/lib/utils/storage';
import { CAREER_DATABASE, getTopJobs } from '@/lib/data/careers';
import { MAJOR_DATABASE, getTopMajors } from '@/lib/data/majors';
import { CONSULTATION_GUIDES } from '@/lib/data/consultation';
import { IB_PROFILE_NAMES } from '@/lib/types/result';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultationMode, setSelectedConsultationMode] = useState<string | null>(null);

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

        // 점수 계산
        const scores = calculateScores(responses);
        const topCategories = getTopCategories(scores, 3);

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
          body: JSON.stringify(data)
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

        // sessionStorage 정리
        sessionStorage.clear();

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
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">오류 발생</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <Button>처음으로 돌아가기</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!result) return null;

  const maxScore = Math.max(...Object.values(result.scores));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl">🎉</span>
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
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">AI 분석</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {result.aiInsights}
              </p>
            </div>
          </div>
        </Card>

        {/* 직업군 점수 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">직업군별 점수</h2>
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
                        {index < 3 && <span className="text-2xl">{['🥇', '🥈', '🥉'][index]}</span>}
                        <span className={`font-semibold ${isTop ? 'text-lg' : 'text-base text-gray-600'}`}>
                          {CAREER_CATEGORY_NAMES[category as keyof CategoryScores]}
                        </span>
                      </div>
                      <span className={`font-bold ${isTop ? 'text-lg text-blue-600' : 'text-gray-500'}`}>
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
        </Card>

        {/* 상위 직업군 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {result.topCategories.map((category, index) => (
            <Card key={category} variant="elevated" className="hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{['🥇', '🥈', '🥉'][index]}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {CAREER_CATEGORY_NAMES[category]}
                  </h3>
                  <p className="text-sm text-gray-600">점수: {result.scores[category]}</p>
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
            </Card>
          ))}
        </div>

        {/* 발전 팁 */}
        {result.developmentTips && (
          <Card className="mb-12 bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">재능 발전 팁</h2>
                <p className="text-gray-700 leading-relaxed">
                  {result.developmentTips}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* IB 학습자상 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">IB 학습자상 연계</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            이 아이는{' '}
            <strong className="text-blue-600">
              {result.ibProfiles.map(profile => IB_PROFILE_NAMES[profile]).join(', ')}
            </strong>
            의 특징이 강합니다.
          </p>
        </Card>

        {/* 상담 가이드 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">상담 모드별 가이드</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Object.entries(CONSULTATION_GUIDES).map(([mode, guide]) => (
              <Button
                key={mode}
                variant={selectedConsultationMode === mode ? 'primary' : 'outline'}
                onClick={() => setSelectedConsultationMode(mode)}
                className="text-sm"
              >
                {guide.title.split(' ')[0]}
              </Button>
            ))}
          </div>

          {selectedConsultationMode && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-2">{CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].title}</h3>
              <p className="text-gray-600 mb-4">{CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].description}</p>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">💡 상담 팁</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {CONSULTATION_GUIDES[selectedConsultationMode as keyof typeof CONSULTATION_GUIDES].tips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">💬 예시 문장</h4>
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
        </Card>

        {/* 액션 버튼 */}
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" fullWidth>
              새로운 검사 시작하기
            </Button>
          </Link>
          <Button
            variant="primary"
            fullWidth
            className="flex-1"
            onClick={() => window.print()}
          >
            결과 인쇄하기
          </Button>
        </div>
      </div>
    </div>
  );
}
