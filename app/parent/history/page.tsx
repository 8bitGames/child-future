'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSelectedChildId, getChildResults, getSelectedChild, deleteChildResult, compareChildResults, ComparisonResult } from '@/lib/utils/child-storage';
import { AssessmentResult, CategoryScores, IB_PROFILE_NAMES, IBProfile } from '@/lib/types/result';
import { CAREER_CATEGORY_NAMES } from '@/lib/types/assessment';
import {
  History,
  ArrowLeft,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
  User,
  BookOpen,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState<string>('');
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  useEffect(() => {
    const id = getSelectedChildId();
    if (!id) {
      router.push('/parent');
      return;
    }
    setChildId(id);

    const child = getSelectedChild();
    if (child) {
      setChildName(child.nickname || child.name);
    }

    const storedResults = getChildResults(id);
    // 최신순 정렬
    setResults(storedResults.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
    setLoading(false);
  }, [router]);

  const handleDelete = (resultId: string) => {
    if (!childId) return;
    if (confirm('이 검사 결과를 삭제하시겠습니까?')) {
      deleteChildResult(childId, resultId);
      setResults(prev => prev.filter(r => r.id !== resultId));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSelectForCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (!childId || selectedForCompare.length !== 2) return;
    const result = compareChildResults(childId, selectedForCompare[0], selectedForCompare[1]);
    setComparisonResult(result);
  };

  const renderScoreBar = (score: number, maxScore: number, isTop: boolean) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-500 rounded-full ${
            isTop ? 'bg-blue-500' : 'bg-gray-400'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const renderTrendIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/parent">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <History className="h-7 w-7 text-indigo-600" />
                검사 히스토리
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                총 {results.length}개의 검사 결과
              </p>
            </div>
          </div>

          {results.length >= 2 && (
            <Button
              variant={compareMode ? 'default' : 'outline'}
              onClick={() => {
                setCompareMode(!compareMode);
                setSelectedForCompare([]);
                setComparisonResult(null);
              }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {compareMode ? '비교 취소' : '결과 비교'}
            </Button>
          )}
        </div>

        {/* 비교 모드 안내 */}
        {compareMode && (
          <Card className="mb-6 bg-indigo-50 border-indigo-200">
            <CardContent className="pt-4">
              <p className="text-indigo-700 text-sm">
                비교할 검사 결과 2개를 선택해주세요.
                ({selectedForCompare.length}/2 선택됨)
              </p>
              {selectedForCompare.length === 2 && (
                <Button
                  className="mt-3 bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleCompare}
                >
                  선택한 결과 비교하기
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 비교 결과 */}
        {comparisonResult && (
          <Card className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                검사 결과 비교
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">최근 검사</p>
                  <p className="font-semibold">
                    {new Date(comparisonResult.current.timestamp).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">이전 검사</p>
                  <p className="font-semibold">
                    {new Date(comparisonResult.previous.timestamp).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">점수 변화</h4>
                {Object.entries(comparisonResult.scoreDifferences).map(([category, diff]) => (
                  <div key={category} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-medium">
                      {CAREER_CATEGORY_NAMES[category as keyof typeof CAREER_CATEGORY_NAMES]}
                    </span>
                    <div className="flex items-center gap-2">
                      {renderTrendIcon(diff)}
                      <span className={`text-sm font-bold ${
                        diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  setComparisonResult(null);
                  setSelectedForCompare([]);
                }}
              >
                비교 닫기
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 결과 없음 */}
        {results.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                저장된 검사 결과가 없습니다
              </h2>
              <p className="text-gray-500 mb-6">
                진로 탐색 검사를 진행해보세요!
              </p>
              <Link href="/parent">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  검사 시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* 결과 목록 */
          <div className="space-y-4">
            {results.map((result, index) => {
              const isExpanded = expandedId === result.id;
              const isSelected = selectedForCompare.includes(result.id);
              const maxScore = Math.max(...Object.values(result.scores));

              return (
                <Card
                  key={result.id}
                  className={`transition-all duration-200 ${
                    isSelected ? 'ring-2 ring-indigo-500' : ''
                  } ${compareMode ? 'cursor-pointer hover:border-indigo-300' : ''}`}
                  onClick={() => compareMode && handleSelectForCompare(result.id)}
                >
                  <CardContent className="pt-6">
                    {/* 헤더 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {compareMode && (
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="text-xs font-bold">
                              {selectedForCompare.indexOf(result.id) + 1}
                            </span>}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-bold text-lg text-gray-900">
                              {result.basicInfo.nickname}
                            </span>
                            {index === 0 && (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                최신
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(result.timestamp).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>

                      {!compareMode && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(result.id);
                            }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(result.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* 요약 정보 */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* 상위 직업군 */}
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">상위 직업군</p>
                        <div className="flex flex-wrap gap-1">
                          {(result.topCategories || []).slice(0, 2).map((category) => (
                            <span
                              key={category}
                              className="px-2 py-0.5 bg-white text-blue-700 text-xs rounded-full"
                            >
                              {CAREER_CATEGORY_NAMES[category]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* IB 학습자상 */}
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium mb-1 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          IB 학습자상
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {(result.ibProfiles || []).slice(0, 2).map((profile) => (
                            <span
                              key={profile}
                              className="px-2 py-0.5 bg-white text-purple-700 text-xs rounded-full"
                            >
                              {IB_PROFILE_NAMES[profile as IBProfile]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 확장된 상세 정보 */}
                    {isExpanded && (
                      <div className="border-t pt-4 mt-4 space-y-4">
                        {/* 직업군별 점수 */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">직업군별 점수</h4>
                          <div className="space-y-2">
                            {Object.entries(result.scores)
                              .sort((a, b) => b[1] - a[1])
                              .map(([category, score], idx) => (
                                <div key={category}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700">
                                      {CAREER_CATEGORY_NAMES[category as keyof CategoryScores]}
                                    </span>
                                    <span className="font-medium">{score}점</span>
                                  </div>
                                  {renderScoreBar(score, maxScore, idx < 3)}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* AI 분석 */}
                        {result.aiInsights && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">AI 분석</h4>
                            <p className="text-sm text-gray-700">{result.aiInsights}</p>
                          </div>
                        )}

                        {/* 추천 직업 */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">추천 직업</h4>
                          <div className="flex flex-wrap gap-2">
                            {(result.jobs || []).slice(0, 6).map((job) => (
                              <span
                                key={job.title}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {job.icon} {job.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 상세 보기 버튼 */}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            // 결과를 sessionStorage에 저장하고 결과 페이지로 이동
                            sessionStorage.setItem('viewingResultId', result.id);
                            router.push(`/parent/results?view=${result.id}`);
                          }}
                        >
                          전체 결과 보기
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* 새 검사 시작 버튼 */}
        {results.length > 0 && (
          <div className="mt-8 text-center">
            <Link href="/parent">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                새로운 검사 시작
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
