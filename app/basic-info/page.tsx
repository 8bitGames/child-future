'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Stepper } from '@/components/ui/stepper';
import { BasicInfo } from '@/lib/types/assessment';
import { X, Plus, ArrowLeft, ArrowRight } from 'lucide-react';

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
    achievements: [],
    likes: [],
    dreamJob: [],
    dislikes: []
  });

  // 동적 입력 필드 관리
  const [activityInput, setActivityInput] = useState('');
  const [hobbyInput, setHobbyInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');
  const [likeInput, setLikeInput] = useState('');
  const [dreamInput, setDreamInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');

  const handleAddItem = (field: keyof Pick<BasicInfo, 'activities' | 'hobbies' | 'interests' | 'strongSubjects' | 'achievements' | 'likes' | 'dreamJob' | 'dislikes'>, value: string, setter: (val: string) => void, inputId?: string) => {
    if (!value.trim()) return;

    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setter('');

    // 모바일에서 키보드 유지를 위해 input에 다시 focus
    if (inputId) {
      setTimeout(() => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        input?.focus();
      }, 0);
    }
  };

  const handleRemoveItem = (field: keyof Pick<BasicInfo, 'activities' | 'hobbies' | 'interests' | 'strongSubjects' | 'achievements' | 'likes' | 'dreamJob' | 'dislikes'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
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
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 상단 고정 진행 단계 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b shadow-sm py-3 px-4 sm:hidden">
        <div className="max-w-3xl mx-auto">
          <Stepper
            currentStep={1}
            steps={['기본정보', '상담내용', '성향테스트', '결과']}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* 모바일 상단 스페이서 */}
        <div className="h-14 sm:hidden" />

        {/* 데스크톱 진행 단계 */}
        <div className="hidden sm:block mb-8">
          <Stepper
            currentStep={1}
            steps={['기본정보', '상담내용', '성향테스트', '결과']}
          />
        </div>

        {/* 헤더 */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-gray-900">기본 정보 입력</h1>
          <p className="text-sm sm:text-base text-gray-600">아이에 대해 알려주세요</p>
        </div>

        {/* 폼 */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* 애칭 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">아이 애칭 (별명)</Label>
                <Input
                  id="nickname"
                  placeholder="예: 제이, 쭌이, 우니"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">결과 화면에서 사용될 이름입니다</p>
              </div>

              {/* 나이 & 성별 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">만 나이</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="예: 10"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    required
                    min={1}
                    max={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">성별</Label>
                  <select
                    id="gender"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
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
              <div className="space-y-2">
                <Label>다니는 학원 / 방과후 / 운동 활동</Label>
                <div className="flex gap-2">
                  <Input
                    id="activity-input"
                    placeholder="예: 수학학원, 피아노, 태권도"
                    value={activityInput}
                    onChange={(e) => setActivityInput(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('activities', activityInput, setActivityInput, 'activity-input'))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddItem('activities', activityInput, setActivityInput, 'activity-input')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.activities.map((activity, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {activity}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('activities', index)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 취미 */}
              <div className="space-y-2">
                <Label>취미 활동</Label>
                <div className="flex gap-2">
                  <Input
                    id="hobby-input"
                    placeholder="예: 게임, 그림 그리기, 책 읽기"
                    value={hobbyInput}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('hobbies', hobbyInput, setHobbyInput, 'hobby-input'))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddItem('hobbies', hobbyInput, setHobbyInput, 'hobby-input')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.hobbies.map((hobby, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {hobby}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('hobbies', index)}
                        className="hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 관심사 */}
              <div className="space-y-2">
                <Label>관심사</Label>
                <div className="flex gap-2">
                  <Input
                    id="interest-input"
                    placeholder="예: 공룡, 우주, 로봇, 요리"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('interests', interestInput, setInterestInput, 'interest-input'))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddItem('interests', interestInput, setInterestInput, 'interest-input')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('interests', index)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 잘하는 과목 */}
              <div className="space-y-2">
                <Label>성적이 높은 과목 / 자신있어하는 과목</Label>
                <div className="flex gap-2">
                  <Input
                    id="subject-input"
                    placeholder="예: 수학, 과학, 미술"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('strongSubjects', subjectInput, setSubjectInput, 'subject-input'))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddItem('strongSubjects', subjectInput, setSubjectInput, 'subject-input')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.strongSubjects.map((subject, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('strongSubjects', index)}
                        className="hover:text-yellow-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 특별한 경험 */}
              <div className="space-y-2">
                <Label>특별한 경험 (선택)</Label>
                <div className="flex gap-2">
                  <Input
                    id="achievement-input"
                    placeholder="예: 캠프, 발표회, 대회, 여행, 봉사활동"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('achievements', achievementInput, setAchievementInput, 'achievement-input'))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddItem('achievements', achievementInput, setAchievementInput, 'achievement-input')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.achievements.map((achievement, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {achievement}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('achievements', index)}
                        className="hover:text-red-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 아이의 생각 섹션 */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  아래 항목은 선택사항이며, AI가 결과 분석 시 참고합니다
                </p>

                {/* 좋아하는 것 */}
                <div className="space-y-2 mb-4">
                  <Label>좋아하는 것 (선택)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="like-input"
                      placeholder="예: 동물, 만들기, 춤추기"
                      value={likeInput}
                      onChange={(e) => setLikeInput(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('likes', likeInput, setLikeInput, 'like-input'))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddItem('likes', likeInput, setLikeInput, 'like-input')}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.likes || []).map((like, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                        {like}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('likes', index)}
                          className="hover:text-pink-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 되고 싶은 것 */}
                <div className="space-y-2 mb-4">
                  <Label>되고 싶은 것 / 꿈 (선택)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="dream-input"
                      placeholder="예: 과학자, 유튜버, 선생님"
                      value={dreamInput}
                      onChange={(e) => setDreamInput(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('dreamJob', dreamInput, setDreamInput, 'dream-input'))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddItem('dreamJob', dreamInput, setDreamInput, 'dream-input')}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.dreamJob || []).map((dream, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                        {dream}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('dreamJob', index)}
                          className="hover:text-indigo-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 싫어하는 것 */}
                <div className="space-y-2">
                  <Label>싫어하는 것 (선택)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="dislike-input"
                      placeholder="예: 발표하기, 계산하기, 혼자 있기"
                      value={dislikeInput}
                      onChange={(e) => setDislikeInput(e.target.value)}
                      onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('dislikes', dislikeInput, setDislikeInput, 'dislike-input'))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddItem('dislikes', dislikeInput, setDislikeInput, 'dislike-input')}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(formData.dislikes || []).map((dislike, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {dislike}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('dislikes', index)}
                          className="hover:text-gray-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 데스크톱 버튼 */}
              <div className="hidden sm:flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => router.push('/')}
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
            onClick={() => router.push('/')}
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
