'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/ui/stepper';
import { ConsultationFeedback } from '@/lib/types/assessment';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';

export function ConsultationClient() {
  const router = useRouter();
  const [formData, setFormData] = useState<ConsultationFeedback>({
    schoolFeedback: '',
    academyFeedback: ''
  });

  useEffect(() => {
    // 이전 단계 데이터 확인
    const basicInfo = sessionStorage.getItem('basicInfo');
    if (!basicInfo) {
      router.push('/parent/basic-info');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // sessionStorage에 저장
    sessionStorage.setItem('consultation', JSON.stringify(formData));

    // 다음 단계로
    router.push('/parent/assessment');
  };

  const handleBack = () => {
    router.push('/parent/parent-info');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 상단 고정 진행 단계 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm py-3 px-4 sm:hidden">
        <div className="max-w-3xl mx-auto">
          <Stepper
            currentStep={3}
            steps={['기본정보', '관찰평가', '상담내용', '성향테스트', '상황질문', '결과']}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* 모바일 상단 스페이서 */}
        <div className="h-14 sm:hidden" />

        {/* 데스크톱 진행 단계 */}
        <div className="hidden sm:block mb-8">
          <Stepper
            currentStep={3}
            steps={['기본정보', '관찰평가', '상담내용', '성향테스트', '상황질문', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">상담에서 들은 말</h1>
          <p className="text-sm sm:text-base text-gray-600">학교나 학원 선생님께서 자주 하시는 말씀을 적어주세요</p>
        </div>

        {/* 폼 */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schoolFeedback">학교 상담에서 자주 들은 말</Label>
                <Textarea
                  id="schoolFeedback"
                  placeholder='"집중력은 짧지만 아이디어가 많아요", "친구들을 잘 챙겨요"'
                  value={formData.schoolFeedback}
                  onChange={(e) => setFormData({ ...formData, schoolFeedback: e.target.value })}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">선생님이나 담임께서 아이에 대해 자주 하시는 말씀을 자유롭게 적어주세요</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="academyFeedback">학원 상담에서 자주 들은 말</Label>
                <Textarea
                  id="academyFeedback"
                  placeholder='"리듬감이 좋아요", "실수는 있지만 금방 따라잡아요"'
                  value={formData.academyFeedback}
                  onChange={(e) => setFormData({ ...formData, academyFeedback: e.target.value })}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">학원이나 과외 선생님께서 아이에 대해 자주 하시는 말씀을 적어주세요</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <strong>Tip:</strong> 상담 내용이 없어도 괜찮습니다.
                  건너뛰고 다음 단계로 진행할 수 있어요.
                </p>
              </div>

              {/* 데스크톱 버튼 */}
              <div className="hidden sm:flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  이전
                </Button>
                <Button type="submit" size="lg" className="flex-1">
                  다음
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 모바일 하단 고정 버튼 */}
        <div className="h-20 sm:hidden" /> {/* 스페이서 */}
      </div>

      {/* 모바일 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg sm:hidden">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('form')?.requestSubmit();
            }}
          >
            다음
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
