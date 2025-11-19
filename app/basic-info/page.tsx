'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { BasicInfo } from '@/lib/types/assessment';

export default function BasicInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BasicInfo>({
    nickname: '',
    age: 0,
    gender: undefined,
    activities: [],
    hobbies: [],
    interests: [],
    strongSubjects: [],
    achievements: []
  });

  // 동적 입력 필드 관리
  const [activityInput, setActivityInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  const handleAddItem = (field: keyof Pick<BasicInfo, 'activities' | 'hobbies' | 'interests' | 'strongSubjects' | 'achievements'>, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    setter('');
  };

  const handleRemoveItem = (field: keyof Pick<BasicInfo, 'activities' | 'hobbies' | 'interests' | 'strongSubjects' | 'achievements'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!formData.nickname.trim()) {
      alert('아이의 애칭을 입력해주세요');
      return;
    }

    if (!formData.age || formData.age < 1 || formData.age > 100) {
      alert('올바른 나이를 입력해주세요');
      return;
    }

    // sessionStorage에 저장
    sessionStorage.setItem('basicInfo', JSON.stringify(formData));

    // 다음 단계로
    router.push('/consultation');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        {/* 진행 단계 */}
        <div className="mb-8">
          <Progress
            currentStep={1}
            totalSteps={4}
            steps={['기본정보', '상담내용', '성향테스트', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">기본 정보 입력</h1>
          <p className="text-gray-600">아이에 대해 알려주세요</p>
        </div>

        {/* 폼 */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 애칭 */}
            <Input
              label="아이 애칭 (별명)"
              placeholder="예: 제이, 쭌이, 토리"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              required
              helperText="결과 화면에서 사용될 이름입니다"
            />

            {/* 나이 & 성별 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="나이"
                placeholder="예: 10"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                required
                min={1}
                max={100}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성별
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as BasicInfo['gender'] || undefined })}
                >
                  <option value="">선택 안 함</option>
                  <option value="male">남자</option>
                  <option value="female">여자</option>
                  <option value="prefer-not-to-say">선택 안 함</option>
                </select>
              </div>
            </div>

            {/* 활동 (학원, 방과후, 운동) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                다니는 학원 / 방과후 / 운동 활동
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="예: 수학학원, 피아노, 태권도"
                  value={activityInput}
                  onChange={(e) => setActivityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('activities', activityInput, setActivityInput))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('activities', activityInput, setActivityInput)}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.activities.map((activity, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {activity}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('activities', index)}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 취미 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                취미 활동
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="예: 게임, 그림 그리기, 책 읽기"
                  value={hobbyInput}
                  onChange={(e) => setHobbyInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('hobbies', hobbyInput, setHobbyInput))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('hobbies', hobbyInput, setHobbyInput)}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.hobbies.map((hobby, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {hobby}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('hobbies', index)}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 관심사 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관심사
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="예: 공룡, 우주, 로봇, 요리"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('interests', interestInput, setInterestInput))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('interests', interestInput, setInterestInput)}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('interests', index)}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 잘하는 과목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성적이 높은 과목 / 자신있어하는 과목
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="예: 수학, 과학, 미술"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('strongSubjects', subjectInput, setSubjectInput))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('strongSubjects', subjectInput, setSubjectInput)}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.strongSubjects.map((subject, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    {subject}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('strongSubjects', index)}
                      className="hover:text-yellow-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 받은 상 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상 받은 이력 (선택)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="예: 수학 경시대회, 미술 대회"
                  value={achievementInput}
                  onChange={(e) => setAchievementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('achievements', achievementInput, setAchievementInput))}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem('achievements', achievementInput, setAchievementInput)}
                >
                  추가
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.achievements.map((achievement, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {achievement}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('achievements', index)}
                      className="hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => router.push('/')}
              >
                이전
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
