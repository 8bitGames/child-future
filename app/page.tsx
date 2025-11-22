'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Zap, ClipboardList, FileText, Bot, Target, Lightbulb } from 'lucide-react';

export default function Home() {
  const handleModeSelect = (mode: 'quick' | 'full') => {
    sessionStorage.setItem('assessmentMode', mode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 메인 헤더 */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <Target className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
            아이의 미래를
            <br />
            <span className="text-blue-600">함께 그려요</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
            아이의 성향과 성장을 기록해서
            <br className="sm:hidden" />
            진로를 함께 탐색해보아요
          </p>

          {/* 모드 선택 버튼 */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
            <Link href="/basic-info" onClick={() => handleModeSelect('quick')} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full h-auto border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50">
                <div className="text-left flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <div className="font-bold">빠른 검사</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">10문항 · 2-3분</div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/basic-info" onClick={() => handleModeSelect('full')} className="w-full sm:w-auto">
              <Button size="lg" className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full h-auto bg-gray-900 hover:bg-gray-800">
                <div className="text-left flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 shrink-0" />
                  <div>
                    <div className="font-bold">정밀 검사</div>
                    <div className="text-xs sm:text-sm opacity-90">24문항 · 5-7분</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* 특징 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-20">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center shadow-sm">
            <div className="flex justify-center mb-3 sm:mb-4">
              <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-700">간단한 입력</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              아이의 활동과 성향을<br />
              쉽게 입력하세요
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center shadow-sm">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Bot className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-700">AI 분석</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              구글 Gemini AI로<br />
              전문가 수준의 진로 분석
            </p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center shadow-sm">
            <div className="flex justify-center mb-3 sm:mb-4">
              <Target className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-700">맞춤 추천</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              직업과 전공 가이드<br />
              상담 팁 제공
            </p>
          </div>
        </div>

        {/* 부가 정보 */}
        <div className="mt-8 sm:mt-16 text-center flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-500" />
          <p className="text-xs sm:text-sm text-gray-500">
            빠른 검사 후 정밀 검사로 확장할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}
