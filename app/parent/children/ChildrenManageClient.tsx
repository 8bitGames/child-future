'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ChildProfile,
  CreateChildData,
  AVATAR_EMOJIS,
} from '@/lib/types/child';
import {
  getChildren,
  addChild,
  updateChild,
  deleteChild,
  getSelectedChildId,
  setSelectedChildId,
  getChildResults,
  migrateToMultiChild,
} from '@/lib/utils/child-storage';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  User,
  Calendar,
  FileText,
} from 'lucide-react';

export function ChildrenManageClient() {
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 새 아이 폼 상태
  const [newName, setNewName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newAvatar, setNewAvatar] = useState('🧒');
  const [newBirthYear, setNewBirthYear] = useState<number | undefined>();

  // 수정 폼 상태
  const [editName, setEditName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editBirthYear, setEditBirthYear] = useState<number | undefined>();

  useEffect(() => {
    // 마이그레이션 시도
    migrateToMultiChild();

    // 데이터 로드
    setChildren(getChildren());
    setSelectedId(getSelectedChildId());
  }, []);

  const handleAddChild = () => {
    if (!newName.trim()) return;

    const childData: CreateChildData = {
      name: newName.trim(),
      nickname: newNickname.trim() || newName.trim(),
      avatar: newAvatar,
      birthYear: newBirthYear,
    };

    const newChild = addChild(childData);
    setChildren(getChildren());
    setSelectedId(getSelectedChildId());

    // 폼 초기화
    setNewName('');
    setNewNickname('');
    setNewAvatar('🧒');
    setNewBirthYear(undefined);
    setIsAdding(false);
  };

  const handleStartEdit = (child: ChildProfile) => {
    setEditingId(child.id);
    setEditName(child.name);
    setEditNickname(child.nickname);
    setEditAvatar(child.avatar);
    setEditBirthYear(child.birthYear);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName.trim()) return;

    updateChild(editingId, {
      name: editName.trim(),
      nickname: editNickname.trim() || editName.trim(),
      avatar: editAvatar,
      birthYear: editBirthYear,
    });

    setChildren(getChildren());
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteChild = (id: string) => {
    deleteChild(id);
    setChildren(getChildren());
    setSelectedId(getSelectedChildId());
    setDeleteConfirmId(null);
  };

  const handleSelectChild = (id: string) => {
    setSelectedChildId(id);
    setSelectedId(id);
  };

  const getChildAge = (birthYear?: number): string => {
    if (!birthYear) return '';
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    return `만 ${age}세`;
  };

  const getChildResultCount = (childId: string): number => {
    return getChildResults(childId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/parent">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">아이 관리</h1>
        </div>

        {/* 현재 선택된 아이 표시 */}
        {selectedId && (
          <div className="bg-blue-100 border border-blue-200 rounded-xl p-3 mb-6">
            <p className="text-sm text-blue-700">
              <Check className="w-4 h-4 inline mr-1" />
              현재 선택:{' '}
              <strong>
                {children.find((c) => c.id === selectedId)?.nickname || '없음'}
              </strong>
            </p>
          </div>
        )}

        {/* 아이 목록 */}
        <div className="space-y-4 mb-6">
          {children.length === 0 && !isAdding && (
            <div className="bg-white rounded-2xl p-8 shadow-md text-center">
              <div className="text-5xl mb-4">👶</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                등록된 아이가 없어요
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                아래 버튼을 눌러 아이를 추가해주세요
              </p>
            </div>
          )}

          {children.map((child) => (
            <div key={child.id}>
              {editingId === child.id ? (
                // 수정 모드
                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-blue-400">
                  <h3 className="font-bold text-gray-800 mb-4">아이 정보 수정</h3>

                  {/* 아바타 선택 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      아바타
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setEditAvatar(emoji)}
                          className={`w-10 h-10 text-xl rounded-full flex items-center justify-center transition-all ${
                            editAvatar === emoji
                              ? 'bg-blue-500 ring-2 ring-blue-300 scale-110'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 이름 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이름 *
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="아이 이름"
                    />
                  </div>

                  {/* 별명 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      별명 (화면 표시용)
                    </label>
                    <input
                      type="text"
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="별명 (비워두면 이름 사용)"
                    />
                  </div>

                  {/* 출생연도 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      출생연도
                    </label>
                    <input
                      type="number"
                      value={editBirthYear || ''}
                      onChange={(e) =>
                        setEditBirthYear(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="예: 2016"
                      min={2000}
                      max={new Date().getFullYear()}
                    />
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="flex-1 rounded-xl"
                    >
                      <X className="w-4 h-4 mr-1" />
                      취소
                    </Button>
                    <Button
                      onClick={handleSaveEdit}
                      disabled={!editName.trim()}
                      className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      저장
                    </Button>
                  </div>
                </div>
              ) : deleteConfirmId === child.id ? (
                // 삭제 확인
                <div className="bg-red-50 rounded-2xl p-5 border-2 border-red-300">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">⚠️</div>
                    <h3 className="font-bold text-red-700">
                      정말 삭제하시겠습니까?
                    </h3>
                    <p className="text-sm text-red-600 mt-1">
                      {child.nickname}의 모든 데이터가 삭제됩니다.
                      <br />
                      (검사 결과, 미션, 배지, 일기 등)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirmId(null)}
                      className="flex-1 rounded-xl"
                    >
                      취소
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteChild(child.id)}
                      className="flex-1 rounded-xl"
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                // 일반 표시
                <div
                  className={`bg-white rounded-2xl p-5 shadow-md transition-all ${
                    selectedId === child.id
                      ? 'ring-2 ring-blue-400'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* 아바타 */}
                    <button
                      onClick={() => handleSelectChild(child.id)}
                      className={`w-16 h-16 text-3xl rounded-2xl flex items-center justify-center transition-all ${
                        selectedId === child.id
                          ? 'bg-blue-500 ring-2 ring-blue-300'
                          : 'bg-gray-100 hover:bg-blue-100'
                      }`}
                    >
                      {child.avatar}
                    </button>

                    {/* 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">
                          {child.nickname}
                        </h3>
                        {selectedId === child.id && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            선택됨
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        {child.name !== child.nickname && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {child.name}
                          </div>
                        )}
                        {child.birthYear && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {getChildAge(child.birthYear)}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          검사 {getChildResultCount(child.id)}회
                        </div>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(child)}
                        className="rounded-full hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirmId(child.id)}
                        className="rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {/* 선택 버튼 */}
                  {selectedId !== child.id && (
                    <Button
                      variant="outline"
                      onClick={() => handleSelectChild(child.id)}
                      className="w-full mt-4 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      이 아이 선택하기
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 새 아이 추가 폼 */}
        {isAdding ? (
          <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-green-400">
            <h3 className="font-bold text-gray-800 mb-4">새 아이 추가</h3>

            {/* 아바타 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                아바타
              </label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewAvatar(emoji)}
                    className={`w-10 h-10 text-xl rounded-full flex items-center justify-center transition-all ${
                      newAvatar === emoji
                        ? 'bg-green-500 ring-2 ring-green-300 scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 이름 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="아이 이름"
              />
            </div>

            {/* 별명 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                별명 (화면 표시용)
              </label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="별명 (비워두면 이름 사용)"
              />
            </div>

            {/* 출생연도 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                출생연도
              </label>
              <input
                type="number"
                value={newBirthYear || ''}
                onChange={(e) =>
                  setNewBirthYear(
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="예: 2016"
                min={2000}
                max={new Date().getFullYear()}
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewName('');
                  setNewNickname('');
                  setNewAvatar('🧒');
                  setNewBirthYear(undefined);
                }}
                className="flex-1 rounded-xl"
              >
                <X className="w-4 h-4 mr-1" />
                취소
              </Button>
              <Button
                onClick={handleAddChild}
                disabled={!newName.trim()}
                className="flex-1 rounded-xl bg-green-500 hover:bg-green-600"
              >
                <Check className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full py-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 아이 추가
          </Button>
        )}

        {/* 안내 메시지 */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 mb-2">알아두세요</h4>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• 각 아이의 검사 결과와 활동 기록은 별도로 저장됩니다.</li>
            <li>• 아이를 선택하면 해당 아이의 데이터만 표시됩니다.</li>
            <li>• 아이를 삭제하면 해당 아이의 모든 데이터가 삭제됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
