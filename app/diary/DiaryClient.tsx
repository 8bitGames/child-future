'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLatestResult } from '@/lib/utils/storage';
import { AssessmentResult, IBProfile, IB_PROFILE_NAMES } from '@/lib/types/result';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Calendar,
  Image as ImageIcon,
  X,
  Save,
  Trash2,
  Award,
  Edit3,
  ChevronDown,
  ChevronUp,
  Compass,
  Brain,
  Users,
  Shield,
  Lightbulb,
  Heart,
  Zap,
  Scale,
  Star,
  Camera
} from 'lucide-react';

// 다이어리 엔트리 타입
interface DiaryEntry {
  id: string;
  date: string;
  activity: {
    title: string;
    description: string;
    photos: string[]; // base64
  };
  childReflection: string;
  parentNote?: string;
  ibProfile?: IBProfile;
  badge?: {
    name: string;
    icon: string;
  };
  createdAt: string;
  updatedAt: string;
}

// IB 프로필 아이콘
const IB_PROFILE_ICONS: Record<IBProfile, React.ReactNode> = {
  'Inquirer': <Compass className="w-4 h-4" />,
  'Knowledgeable': <BookOpen className="w-4 h-4" />,
  'Thinker': <Brain className="w-4 h-4" />,
  'Communicator': <Users className="w-4 h-4" />,
  'Principled': <Shield className="w-4 h-4" />,
  'Open-minded': <Lightbulb className="w-4 h-4" />,
  'Caring': <Heart className="w-4 h-4" />,
  'Risk-taker': <Zap className="w-4 h-4" />,
  'Balanced': <Scale className="w-4 h-4" />,
  'Reflective': <Star className="w-4 h-4" />
};

// IB 프로필 색상
const IB_PROFILE_COLORS: Record<IBProfile, string> = {
  'Inquirer': 'bg-purple-100 text-purple-700',
  'Knowledgeable': 'bg-blue-100 text-blue-700',
  'Thinker': 'bg-indigo-100 text-indigo-700',
  'Communicator': 'bg-green-100 text-green-700',
  'Principled': 'bg-amber-100 text-amber-700',
  'Open-minded': 'bg-teal-100 text-teal-700',
  'Caring': 'bg-rose-100 text-rose-700',
  'Risk-taker': 'bg-orange-100 text-orange-700',
  'Balanced': 'bg-cyan-100 text-cyan-700',
  'Reflective': 'bg-violet-100 text-violet-700'
};

export function DiaryClient() {
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(null);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 새 엔트리 폼 상태
  const [newEntry, setNewEntry] = useState<Partial<DiaryEntry>>({
    date: new Date().toISOString().split('T')[0],
    activity: { title: '', description: '', photos: [] },
    childReflection: '',
    parentNote: '',
    ibProfile: undefined
  });

  useEffect(() => {
    const result = getLatestResult();
    setLatestResult(result);

    // localStorage에서 다이어리 불러오기
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    setLoading(false);
  }, []);

  // 데이터 저장
  const saveEntries = (newEntries: DiaryEntry[]) => {
    localStorage.setItem('diaryEntries', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  // 사진 추가
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentPhotos = newEntry.activity?.photos || [];
    if (currentPhotos.length + files.length > 3) {
      alert('사진은 최대 3장까지 추가할 수 있습니다.');
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEntry(prev => ({
          ...prev,
          activity: {
            ...prev.activity!,
            photos: [...(prev.activity?.photos || []), reader.result as string]
          }
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // 사진 삭제
  const removePhoto = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      activity: {
        ...prev.activity!,
        photos: prev.activity?.photos?.filter((_, i) => i !== index) || []
      }
    }));
  };

  // 새 엔트리 저장
  const saveNewEntry = () => {
    if (!newEntry.activity?.title || !newEntry.childReflection) {
      alert('활동 제목과 아이 소감을 입력해주세요.');
      return;
    }

    const entry: DiaryEntry = {
      id: editingId || `diary-${Date.now()}`,
      date: newEntry.date!,
      activity: {
        title: newEntry.activity.title,
        description: newEntry.activity.description || '',
        photos: newEntry.activity.photos || []
      },
      childReflection: newEntry.childReflection,
      parentNote: newEntry.parentNote,
      ibProfile: newEntry.ibProfile,
      createdAt: editingId ? entries.find(e => e.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updated: DiaryEntry[];
    if (editingId) {
      updated = entries.map(e => e.id === editingId ? entry : e);
    } else {
      updated = [entry, ...entries];
    }

    saveEntries(updated);
    resetForm();
  };

  // 엔트리 삭제
  const deleteEntry = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      saveEntries(entries.filter(e => e.id !== id));
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      activity: { title: '', description: '', photos: [] },
      childReflection: '',
      parentNote: '',
      ibProfile: undefined
    });
    setIsAdding(false);
    setEditingId(null);
  };

  // 편집 시작
  const startEdit = (entry: DiaryEntry) => {
    setNewEntry({
      date: entry.date,
      activity: { ...entry.activity },
      childReflection: entry.childReflection,
      parentNote: entry.parentNote,
      ibProfile: entry.ibProfile
    });
    setEditingId(entry.id);
    setIsAdding(true);
  };

  // 날짜 그룹화
  const groupByMonth = (entries: DiaryEntry[]) => {
    const groups: { [key: string]: DiaryEntry[] } = {};
    entries.forEach(entry => {
      const month = entry.date.substring(0, 7); // YYYY-MM
      if (!groups[month]) groups[month] = [];
      groups[month].push(entry);
    });
    return groups;
  };

  const groupedEntries = groupByMonth(entries);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-7 w-7 text-green-600" />
                성장 다이어리
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {latestResult?.basicInfo.nickname || '아이'}의 성장을 기록해요
              </p>
            </div>
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-green-500 hover:bg-green-600"
            >
              <Plus className="h-4 w-4 mr-1" />
              기록 추가
            </Button>
          )}
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-200 rounded-full">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-700">총 기록</p>
                  <p className="text-2xl font-bold text-green-800">{entries.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-teal-100 to-cyan-100 border-teal-200">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-200 rounded-full">
                  <Calendar className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm text-teal-700">기록 개월</p>
                  <p className="text-2xl font-bold text-teal-800">
                    {Object.keys(groupedEntries).length}개월
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 새 기록 / 편집 폼 */}
        {isAdding && (
          <Card className="mb-6 border-2 border-green-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  {editingId ? '기록 수정' : '새 기록'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 날짜 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  날짜
                </label>
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={e => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* 활동 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  활동 제목 *
                </label>
                <input
                  type="text"
                  value={newEntry.activity?.title || ''}
                  onChange={e => setNewEntry(prev => ({
                    ...prev,
                    activity: { ...prev.activity!, title: e.target.value }
                  }))}
                  placeholder="예: 도서관에서 책 읽기"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* 활동 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  활동 내용
                </label>
                <textarea
                  value={newEntry.activity?.description || ''}
                  onChange={e => setNewEntry(prev => ({
                    ...prev,
                    activity: { ...prev.activity!, description: e.target.value }
                  }))}
                  placeholder="무엇을 했나요?"
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>

              {/* 사진 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사진 (최대 3장)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEntry.activity?.photos?.map((photo, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={photo}
                        alt={`사진 ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {(newEntry.activity?.photos?.length || 0) < 3 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-green-500 transition-colors"
                    >
                      <Camera className="h-6 w-6 text-gray-400" />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {/* 아이 소감 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  아이 소감 * 👶
                </label>
                <textarea
                  value={newEntry.childReflection || ''}
                  onChange={e => setNewEntry(prev => ({ ...prev, childReflection: e.target.value }))}
                  placeholder="아이가 느낀 점을 적어주세요"
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>

              {/* 부모 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  부모 관찰 메모 👪 (선택)
                </label>
                <textarea
                  value={newEntry.parentNote || ''}
                  onChange={e => setNewEntry(prev => ({ ...prev, parentNote: e.target.value }))}
                  placeholder="부모님이 관찰한 아이의 모습"
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
              </div>

              {/* IB 프로필 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  관련 IB 학습자상 (선택)
                </label>
                <select
                  value={newEntry.ibProfile || ''}
                  onChange={e => setNewEntry(prev => ({
                    ...prev,
                    ibProfile: e.target.value ? e.target.value as IBProfile : undefined
                  }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">선택 안함</option>
                  {Object.entries(IB_PROFILE_NAMES).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              {/* 저장 버튼 */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={saveNewEntry}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? '수정 완료' : '저장하기'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 타임라인 */}
        {entries.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedEntries)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([month, monthEntries]) => (
                <div key={month}>
                  <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    {new Date(month + '-01').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                  </h2>
                  <div className="space-y-3">
                    {monthEntries
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map(entry => {
                        const isExpanded = expandedId === entry.id;
                        return (
                          <Card
                            key={entry.id}
                            className="border-l-4 border-l-green-400"
                          >
                            <CardContent className="pt-4">
                              {/* 엔트리 헤더 */}
                              <div
                                className="flex items-start justify-between cursor-pointer"
                                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                              >
                                <div className="flex gap-3">
                                  {/* 사진 썸네일 */}
                                  {entry.activity.photos.length > 0 ? (
                                    <img
                                      src={entry.activity.photos[0]}
                                      alt="활동 사진"
                                      className="w-16 h-16 object-cover rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <ImageIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      {new Date(entry.date).toLocaleDateString('ko-KR', {
                                        month: 'long',
                                        day: 'numeric',
                                        weekday: 'short'
                                      })}
                                    </p>
                                    <h3 className="font-semibold text-gray-900">
                                      {entry.activity.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                      "{entry.childReflection}"
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {entry.ibProfile && (
                                    <span className={`p-1 rounded ${IB_PROFILE_COLORS[entry.ibProfile]}`}>
                                      {IB_PROFILE_ICONS[entry.ibProfile]}
                                    </span>
                                  )}
                                  {entry.badge && (
                                    <span className="text-lg">{entry.badge.icon}</span>
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                              </div>

                              {/* 확장된 내용 */}
                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t">
                                  {/* 모든 사진 */}
                                  {entry.activity.photos.length > 0 && (
                                    <div className="flex gap-2 mb-4 overflow-x-auto">
                                      {entry.activity.photos.map((photo, idx) => (
                                        <img
                                          key={idx}
                                          src={photo}
                                          alt={`사진 ${idx + 1}`}
                                          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                                        />
                                      ))}
                                    </div>
                                  )}

                                  {/* 활동 설명 */}
                                  {entry.activity.description && (
                                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-sm font-medium text-gray-700 mb-1">활동 내용</p>
                                      <p className="text-sm text-gray-600">{entry.activity.description}</p>
                                    </div>
                                  )}

                                  {/* 아이 소감 */}
                                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm font-medium text-green-700 mb-1 flex items-center gap-1">
                                      👶 아이 소감
                                    </p>
                                    <p className="text-sm text-green-800">"{entry.childReflection}"</p>
                                  </div>

                                  {/* 부모 메모 */}
                                  {entry.parentNote && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                      <p className="text-sm font-medium text-blue-700 mb-1 flex items-center gap-1">
                                        👪 부모 관찰 메모
                                      </p>
                                      <p className="text-sm text-blue-800">{entry.parentNote}</p>
                                    </div>
                                  )}

                                  {/* IB 프로필 & 배지 */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {entry.ibProfile && (
                                      <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${IB_PROFILE_COLORS[entry.ibProfile]}`}>
                                        {IB_PROFILE_ICONS[entry.ibProfile]}
                                        {IB_PROFILE_NAMES[entry.ibProfile]}
                                      </span>
                                    )}
                                    {entry.badge && (
                                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center gap-1">
                                        <Award className="h-4 w-4" />
                                        {entry.badge.icon} {entry.badge.name}
                                      </span>
                                    )}
                                  </div>

                                  {/* 액션 버튼 */}
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEdit(entry);
                                      }}
                                    >
                                      <Edit3 className="h-4 w-4 mr-1" />
                                      수정
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteEntry(entry.id);
                                      }}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      삭제
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              ))}
          </div>
        ) : !isAdding ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                아직 기록이 없어요
              </h2>
              <p className="text-gray-500 mb-4">
                첫 번째 성장 기록을 남겨보세요!
              </p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                첫 기록 추가하기
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {/* 홈으로 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
