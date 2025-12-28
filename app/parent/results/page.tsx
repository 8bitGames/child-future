'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssessmentResult, CategoryScores, AIRecommendedJob } from '@/lib/types/result';
import { AssessmentData, CAREER_CATEGORY_NAMES, AssessmentMode } from '@/lib/types/assessment';
import { calculateScores, getTopCategories } from '@/lib/utils/scoring';
import { saveResult } from '@/lib/utils/storage';
import { getTopJobs } from '@/lib/data/careers';
import { getTopMajors } from '@/lib/data/majors';
import { recommendJobsWithAI } from '@/lib/utils/gemini';
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
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConsultationMode, setSelectedConsultationMode] = useState<string | null>(null);
  const [isQuickMode, setIsQuickMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiRecommendedJobs, setAiRecommendedJobs] = useState<AIRecommendedJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  // 모바일 기기 감지
  const isMobile = () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // PDF로 저장
  const handleSaveAsPDF = async () => {
    if (!resultRef.current || !result) return;

    setIsSaving(true);

    try {
      // 캡처 전 잠시 대기 (렌더링 안정화)
      await new Promise(resolve => setTimeout(resolve, 100));

      const element = resultRef.current;

      // 모바일에서는 scale을 낮춤 (메모리 제한)
      // 데스크톱도 1.5로 낮춰 용량 최적화 (충분히 선명함)
      const scale = isMobile() ? 1.2 : 1.5;

      // PDF 생성 전에 원본 DOM을 임시로 수정하여 섹션 경계 계산
      // (html2canvas의 onclone 콜백보다 먼저 경계를 계산해야 정확한 페이지 분할 가능)

      // 1. 숨길 요소들의 원래 display 값 저장 및 숨기기
      const hideElements = element.querySelectorAll('[data-pdf-hide]');
      const hideOriginalDisplays: string[] = [];
      hideElements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        hideOriginalDisplays[index] = htmlEl.style.display;
        htmlEl.style.display = 'none';
      });

      // 2. PDF용 요소들의 원래 상태 저장 및 표시하기
      const showElements = element.querySelectorAll('[data-pdf-only]');
      const showOriginalStates: { display: string; hadHidden: boolean }[] = [];
      showElements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        showOriginalStates[index] = {
          display: htmlEl.style.display,
          hadHidden: htmlEl.classList.contains('hidden')
        };
        htmlEl.classList.remove('hidden');
        htmlEl.style.display = 'block';
      });

      // DOM 변경 후 레이아웃 재계산을 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 50));

      // 섹션 경계점 찾기 (이제 PDF용 요소들이 보이는 상태에서 계산)
      const sectionElements = element.querySelectorAll('[data-pdf-section]');
      const elementRect = element.getBoundingClientRect();
      const sectionBreakPoints: number[] = [0]; // 시작점

      sectionElements.forEach((section) => {
        // hidden 상태가 아닌 섹션만 경계점에 포함
        const htmlSection = section as HTMLElement;
        if (htmlSection.offsetParent !== null || htmlSection.offsetHeight > 0) {
          const rect = section.getBoundingClientRect();
          // 섹션의 상단 위치 (element 기준 상대 좌표)
          const topPosition = rect.top - elementRect.top;
          // 섹션의 하단 위치 (다음 섹션 시작 전 여백)
          const bottomPosition = rect.bottom - elementRect.top;

          if (topPosition >= 0) {
            sectionBreakPoints.push(topPosition);
            // 섹션 하단도 경계점으로 추가 (섹션 사이 간격에서 자르기 위함)
            sectionBreakPoints.push(bottomPosition);
          }
        }
      });

      // 경계점 정렬 및 중복 제거
      const uniqueBreakPoints = [...new Set(sectionBreakPoints)].sort((a, b) => a - b);

      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb',
        logging: false,
        onclone: (clonedDoc) => {
          // 클론에서도 동일하게 적용 (일관성 보장)
          const clonedHideElements = clonedDoc.querySelectorAll('[data-pdf-hide]');
          clonedHideElements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
          });

          const clonedShowElements = clonedDoc.querySelectorAll('[data-pdf-only]');
          clonedShowElements.forEach((el) => {
            (el as HTMLElement).classList.remove('hidden');
            (el as HTMLElement).style.display = 'block';
          });
        }
      });

      // 3. 원본 DOM 상태 복원
      hideElements.forEach((el, index) => {
        (el as HTMLElement).style.display = hideOriginalDisplays[index];
      });

      showElements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.display = showOriginalStates[index].display;
        if (showOriginalStates[index].hadHidden) {
          htmlEl.classList.add('hidden');
        }
      });

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 사이즈 기준 PDF 생성 (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 이미지를 PDF 너비에 맞춰 비율 계산
      const ratio = pdfWidth / imgWidth;

      // 페이지당 최대 높이 (canvas 픽셀 기준)
      const maxPageHeightPx = pdfHeight / ratio;

      // 섹션 경계점을 canvas 스케일에 맞게 변환
      const scaledBreakPoints = uniqueBreakPoints.map(bp => bp * scale);
      scaledBreakPoints.push(imgHeight); // 마지막 끝점 추가

      // 스마트 페이지 분할: 섹션 경계에서 자르기
      const findBestBreakPoint = (currentY: number, maxY: number): number => {
        // maxY 이하의 가장 가까운 섹션 경계점 찾기
        let bestBreak = maxY;

        for (const breakPoint of scaledBreakPoints) {
          if (breakPoint > currentY && breakPoint <= maxY) {
            bestBreak = breakPoint;
          }
        }

        // 적절한 경계점이 없으면 최대 높이 사용
        if (bestBreak === maxY || bestBreak <= currentY) {
          return maxY;
        }

        return bestBreak;
      };

      // 여러 페이지로 분할
      let yOffset = 0;
      let pageCount = 0;

      while (yOffset < imgHeight) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        // 다음 페이지 경계 찾기
        const idealEndY = yOffset + maxPageHeightPx;
        const actualEndY = Math.min(
          findBestBreakPoint(yOffset, idealEndY),
          imgHeight
        );

        const sourceY = yOffset;
        const sourceHeight = actualEndY - yOffset;

        // 캔버스에서 해당 부분만 추출
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          // 배경을 흰색으로 채우기 (JPEG는 투명 배경 미지원)
          ctx.fillStyle = '#f9fafb';
          ctx.fillRect(0, 0, imgWidth, sourceHeight);

          ctx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );

          // JPEG 포맷 + 80% 품질로 용량 대폭 감소 (PNG 대비 약 90% 절감)
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.8);
          const pageHeight = sourceHeight * ratio;

          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pageHeight);
        }

        yOffset = actualEndY;
        pageCount++;

        // 안전장치: 최대 30페이지
        if (pageCount > 30) break;
      }

      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const fileName = `${result.basicInfo.nickname}_진로탐색결과_${dateStr}.pdf`;

      // 모바일 브라우저 대응
      if (isMobile()) {
        // Blob URL을 만들어 새 탭에서 열기 (iOS Safari 등 지원)
        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);

        // iOS Safari는 window.open이 더 잘 작동
        const newWindow = window.open(blobUrl, '_blank');

        if (!newWindow) {
          // 팝업이 차단된 경우 다운로드 링크 생성
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // 일정 시간 후 Blob URL 해제
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
        // 데스크톱: 일반 다운로드
        pdf.save(fileName);
      }
    } catch (error) {
      console.error('PDF 저장 실패:', error);
      alert('PDF 저장에 실패했습니다. 브라우저 콘솔에서 상세 오류를 확인해주세요.');
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
        const situationResponsesStr = sessionStorage.getItem('situationResponses');
        const parentObservationStr = sessionStorage.getItem('parentObservation');

        if (!basicInfoStr || !consultationStr || !responsesStr) {
          router.push('/parent/basic-info');
          return;
        }

        const basicInfo = JSON.parse(basicInfoStr);
        const consultation = JSON.parse(consultationStr);
        const responses = JSON.parse(responsesStr);

        // 상황 질문 및 관찰 데이터 (선택적)
        const situationResponses = situationResponsesStr ? JSON.parse(situationResponsesStr) : undefined;
        const parentObservation = parentObservationStr ? JSON.parse(parentObservationStr) : undefined;

        // 모드 확인
        const mode = sessionStorage.getItem('assessmentMode') as AssessmentMode || 'full';
        const quickMode = mode === 'quick';
        setIsQuickMode(quickMode);

        // 점수 계산
        const scores = calculateScores(responses);
        const topCategories = getTopCategories(scores, quickMode ? 2 : 3);

        // Gemini API 호출 (확장된 데이터 포함)
        const data: AssessmentData & {
          situationResponses?: unknown;
          parentObservation?: unknown;
        } = {
          basicInfo,
          consultation,
          responses,
          timestamp: new Date().toISOString(),
          situationResponses,
          parentObservation
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
          developmentTips: analysisResult.data?.developmentTips || '',
          ibProfileAnalysis: analysisResult.data?.ibProfileAnalysis || undefined
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
          sessionStorage.removeItem('situationResponses');
          sessionStorage.removeItem('parentObservation');
        }

      } catch (error) {
        console.error('Analysis error:', error);
        setError('결과 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        setLoading(false);
      }
    }

    analyzeResults();
  }, [router]);

  // 2단계: result가 설정되면 AI 맞춤 직업 추천 병렬 호출
  useEffect(() => {
    if (!result || isQuickMode) return;

    const fetchJobRecommendations = async () => {
      setIsLoadingJobs(true);
      try {
        const recommendedJobs = await recommendJobsWithAI(
          {
            nickname: result.basicInfo.nickname,
            age: result.basicInfo.age,
            activities: result.basicInfo.activities || [],
            hobbies: result.basicInfo.hobbies || [],
            interests: result.basicInfo.interests || [],
            strongSubjects: result.basicInfo.strongSubjects || [],
            dreamJob: result.basicInfo.dreamJob || []
          },
          {
            aiInsights: result.aiInsights || '',
            ibProfiles: result.ibProfiles || ['Balanced'],
            ibProfileAnalysis: result.ibProfileAnalysis,
            scores: result.scores
          }
        );
        setAiRecommendedJobs(recommendedJobs);
      } catch (jobError) {
        console.error('AI 직업 추천 오류:', jobError);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobRecommendations();
  }, [result, isQuickMode]);

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
              <Link href="/parent">
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
    router.push('/parent/assessment');
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
              정밀검사로 확장하기 (+24문항)
            </Button>
            <Link href="/parent" className="block">
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
        <Card data-pdf-section className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
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
        <Card data-pdf-section className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
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
        <Card data-pdf-section className="mb-12">
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
        <div data-pdf-section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {result.topCategories.map((category, index) => (
            <Card key={category} data-pdf-section className="shadow-lg hover:shadow-2xl transition-shadow duration-300">
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
          <Card data-pdf-section className="mb-12 bg-yellow-50 border-2 border-yellow-200">
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
        <Card data-pdf-section className="mb-12 border-2 border-purple-200">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-start gap-2">
              <BookOpen className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <span>IB 학습자상 맞춤 교육 가이드</span>
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {result.basicInfo.nickname}님은{' '}
              <strong className="text-purple-600">
                {result.ibProfiles.map(profile => IB_PROFILE_NAMES[profile]).join(', ')}
              </strong>
              의 특징이 강합니다.
            </p>

            {/* IB 프로필 선택 이유 분석 */}
            {result.ibProfileAnalysis && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-800 mb-1">AI 분석 근거</h4>
                    <p className="text-purple-700 text-sm leading-relaxed">
                      {result.ibProfileAnalysis}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {result.ibProfiles.map((profileId) => {
                const profile = getIBProfileDefinition(profileId);
                if (!profile) return null;

                return (
                  <div key={profileId} data-pdf-section className="bg-purple-50 rounded-xl p-6">
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
        <Card data-pdf-section className="mb-12 bg-gray-50">
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
        <Card data-pdf-section className="mb-12">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">상담 모드별 가이드</h2>

            {/* 웹용 탭 인터페이스 - PDF에서는 숨김 */}
            <div data-pdf-hide className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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

            {/* 웹용 선택된 모드만 표시 - PDF에서는 숨김 */}
            {selectedConsultationMode && (
              <div data-pdf-hide className="bg-gray-50 rounded-xl p-6">
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

            {/* PDF용 모든 상담 모드 표시 - 웹에서는 숨김 */}
            <div data-pdf-only className="hidden space-y-6">
              {Object.entries(CONSULTATION_GUIDES).map(([mode, guide]) => (
                <div key={mode} data-pdf-section className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{guide.title}</h3>
                  <p className="text-gray-700 mb-4">{guide.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-900 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      상담 팁
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {guide.tips.map((tip, i) => (
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
                      {guide.exampleQuestions.map((question, i) => (
                        <li key={i} className="bg-white p-3 rounded-lg border border-gray-200 text-gray-700">
                          "{question}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI 맞춤 직업 추천 - 2단계 API 병렬 호출로 마지막에 로드 */}
        <Card data-pdf-section className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-start gap-2">
              <Sparkles className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <span>AI 맞춤 직업 추천</span>
            </h2>
            <p className="text-gray-600 mb-6">
              {result.basicInfo.nickname}님의 IB 학습자상과 성향 분석을 바탕으로 AI가 추천하는 맞춤 직업입니다.
            </p>

            {isLoadingJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI가 맞춤 직업을 분석하고 있습니다...</p>
              </div>
            ) : aiRecommendedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiRecommendedJobs.map((job, index) => (
                  <div
                    key={index}
                    data-pdf-section
                    className="bg-white rounded-xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl">{job.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                        <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {IB_PROFILE_NAMES[job.relatedIBProfile as keyof typeof IB_PROFILE_NAMES] || job.relatedIBProfile}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {job.reason}
                    </p>

                    {job.futureOutlook && (
                      <p className="text-xs text-indigo-600 mb-3 flex items-start gap-1">
                        <Zap className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{job.futureOutlook}</span>
                      </p>
                    )}

                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">필요한 능력</p>
                        <div className="flex flex-wrap gap-1">
                          {job.requiredSkills.map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.relatedActivities && job.relatedActivities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">지금 해볼 수 있는 활동</p>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {job.relatedActivities.map((activity, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-500">•</span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>직업 추천을 불러오지 못했습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 액션 버튼 - PDF 캡처에서 제외 */}
        <div data-pdf-hide className="flex flex-col md:flex-row gap-4 print:hidden">
          <Link href="/parent" className="flex-1">
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              새로운 검사 시작하기
            </Button>
          </Link>
          <Button
            variant="default"
            className="w-full flex-1"
            onClick={handleSaveAsPDF}
            disabled={isSaving}
          >
            <Download className="h-4 w-4 mr-2" />
            {isSaving ? '저장 중...' : 'PDF로 저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
