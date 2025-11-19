import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 메인 헤더 */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-6xl">🌟</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            아이의 미래를
            <br />
            <span className="text-blue-600">함께 그려요</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            아이의 성향과 성장을 기록해서
            <br className="md:hidden" />
            진로를 함께 탐색해보아요
          </p>

          <Link href="/basic-info">
            <Button size="lg" className="px-16 py-5 text-xl shadow-xl hover:shadow-2xl">
              검사 시작하기 →
            </Button>
          </Link>
        </div>

        {/* 특징 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">간단한 입력</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              아이의 활동과 성향을<br />
              쉽게 입력하세요
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">AI 분석</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              구글 Gemini AI로<br />
              전문가 수준의 진로 분석
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">맞춤 추천</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              직업과 전공 가이드<br />
              상담 팁 제공
            </p>
          </div>
        </div>

        {/* 부가 정보 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            💡 검사는 약 10-15분 소요됩니다
          </p>
        </div>
      </div>
    </div>
  );
}
