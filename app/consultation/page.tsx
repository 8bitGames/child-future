'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { ConsultationFeedback } from '@/lib/types/assessment';

export default function ConsultationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ConsultationFeedback>({
    schoolFeedback: '',
    academyFeedback: ''
  });

  useEffect(() => {
    // 이전 단계 데이터 확인
    const basicInfo = sessionStorage.getItem('basicInfo');
    if (!basicInfo) {
      router.push('/basic-info');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // sessionStorage에 저장
    sessionStorage.setItem('consultation', JSON.stringify(formData));

    // 다음 단계로
    router.push('/assessment');
  };

  const handleBack = () => {
    router.push('/basic-info');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* 진행 단계 */}
        <div className="mb-8">
          <Progress
            currentStep={2}
            totalSteps={4}
            steps={['기본정보', '상담내용', '성향테스트', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">상담에서 들은 말</h1>
          <p className="text-gray-600">학교나 학원 선생님께서 자주 하시는 말씀을 적어주세요</p>
        </div>

        {/* 폼 */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextArea
              label="학교 상담에서 자주 들은 말"
              placeholder='예: "집중력은 짧지만 아이디어가 많아요", "친구들을 잘 챙겨요"'
              value={formData.schoolFeedback}
              onChange={(e) => setFormData({ ...formData, schoolFeedback: e.target.value })}
              rows={4}
              helperText="선생님이나 담임께서 아이에 대해 자주 하시는 말씀을 자유롭게 적어주세요"
            />

            <TextArea
              label="학원 상담에서 자주 들은 말"
              placeholder='예: "리듬감이 좋아요", "실수는 있지만 금방 따라잡아요"'
              value={formData.academyFeedback}
              onChange={(e) => setFormData({ ...formData, academyFeedback: e.target.value })}
              rows={4}
              helperText="학원이나 과외 선생님께서 아이에 대해 자주 하시는 말씀을 적어주세요"
            />

            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-sm text-gray-700">
                💡 <strong>Tip:</strong> 상담 내용이 없어도 괜찮습니다.
                건너뛰고 다음 단계로 진행할 수 있어요.
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={handleBack}
              >
                ← 이전
              </Button>
              <Button type="submit" fullWidth>
                다음 단계로 →
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
