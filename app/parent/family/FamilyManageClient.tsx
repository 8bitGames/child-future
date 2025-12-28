'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FamilyCodeDisplay } from '@/components/family/FamilyCodeDisplay';
import { PinPad } from '@/components/auth/PinPad';
import { ArrowLeft, Plus, Key, KeyRound, Trash2, Check, X, Shield } from 'lucide-react';

interface ChildWithPin {
  id: string;
  nickname: string;
  avatar: string;
  pinSet: boolean;
  age?: number;
}

interface FamilyData {
  id: string;
  name: string;
  familyCode: string;
  children: ChildWithPin[];
}

export function FamilyManageClient() {
  const router = useRouter();
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // PIN 관리 상태
  const [settingPinFor, setSettingPinFor] = useState<string | null>(null);
  const [pinStep, setPinStep] = useState<'enter' | 'confirm'>('enter');
  const [firstPin, setFirstPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [savingPin, setSavingPin] = useState(false);

  // 삭제 확인 상태
  const [removingPinFor, setRemovingPinFor] = useState<string | null>(null);

  useEffect(() => {
    fetchFamily();
  }, []);

  const fetchFamily = async () => {
    try {
      const response = await fetch('/api/family');
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 404) {
          // 가족이 없으면 설정 페이지로 이동
          router.push('/auth/family-setup');
          return;
        }
        throw new Error(data.error || '가족 정보를 불러올 수 없습니다.');
      }

      setFamily(data.family);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSetPin = (childId: string) => {
    setSettingPinFor(childId);
    setPinStep('enter');
    setFirstPin('');
    setConfirmPin('');
    setPinError(null);
  };

  const handleCancelSetPin = () => {
    setSettingPinFor(null);
    setPinStep('enter');
    setFirstPin('');
    setConfirmPin('');
    setPinError(null);
  };

  const handleFirstPinComplete = (pin: string) => {
    setFirstPin(pin);
    setPinStep('confirm');
    setPinError(null);
  };

  const handleConfirmPinComplete = async (pin: string) => {
    if (pin !== firstPin) {
      setPinError('PIN이 일치하지 않습니다. 다시 시도해주세요.');
      setConfirmPin('');
      setPinStep('enter');
      setFirstPin('');
      return;
    }

    setSavingPin(true);
    setPinError(null);

    try {
      const response = await fetch(`/api/family/children/${settingPinFor}/pin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'PIN 설정에 실패했습니다.');
      }

      // 가족 데이터 새로고침
      await fetchFamily();
      handleCancelSetPin();
    } catch (err) {
      setPinError(err instanceof Error ? err.message : 'PIN 설정에 실패했습니다.');
      setConfirmPin('');
    } finally {
      setSavingPin(false);
    }
  };

  const handleRemovePin = async (childId: string) => {
    try {
      const response = await fetch(`/api/family/children/${childId}/pin`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'PIN 삭제에 실패했습니다.');
      }

      // 가족 데이터 새로고침
      await fetchFamily();
      setRemovingPinFor(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PIN 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/parent')} variant="outline">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!family) {
    return null;
  }

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
          <div>
            <h1 className="text-xl font-bold text-gray-900">가족 관리</h1>
            <p className="text-sm text-gray-500">{family.name}</p>
          </div>
        </div>

        {/* 가족 코드 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" />
            가족 코드
          </h2>
          <FamilyCodeDisplay code={family.familyCode} size="medium" familyName={family.name} />
        </div>

        {/* 아이 PIN 관리 */}
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-500" />
            아이 로그인 PIN 관리
          </h2>

          {family.children.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">👶</div>
              <p className="text-gray-600 mb-4">등록된 아이가 없어요</p>
              <Link href="/parent/children">
                <Button variant="outline" className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  아이 추가하기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {family.children.map((child) => (
                <div key={child.id}>
                  {/* PIN 설정 모드 */}
                  {settingPinFor === child.id ? (
                    <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-300">
                      {/* 선택된 아이 표시 */}
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-indigo-200">
                        <span className="text-2xl">{child.avatar}</span>
                        <span className="font-bold text-indigo-700">{child.nickname}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelSetPin}
                          className="ml-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* PIN 입력 */}
                      <PinPad
                        value={pinStep === 'enter' ? firstPin : confirmPin}
                        onChange={pinStep === 'enter' ? setFirstPin : setConfirmPin}
                        onComplete={pinStep === 'enter' ? handleFirstPinComplete : handleConfirmPinComplete}
                        disabled={savingPin}
                        error={pinError || undefined}
                        title={pinStep === 'enter' ? 'PIN 입력' : 'PIN 확인'}
                        showValue={true}
                      />

                      {pinStep === 'confirm' && (
                        <p className="text-center text-sm text-indigo-600 mt-2">
                          동일한 PIN을 다시 입력해주세요
                        </p>
                      )}
                    </div>
                  ) : removingPinFor === child.id ? (
                    /* PIN 삭제 확인 */
                    <div className="bg-red-50 rounded-xl p-4 border-2 border-red-300">
                      <div className="text-center mb-4">
                        <p className="font-bold text-red-700">
                          {child.nickname}의 PIN을 삭제하시겠습니까?
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          PIN이 삭제되면 아이가 로그인할 수 없습니다.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setRemovingPinFor(null)}
                          className="flex-1 rounded-xl"
                        >
                          취소
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRemovePin(child.id)}
                          className="flex-1 rounded-xl"
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* 일반 표시 */
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className="text-3xl">{child.avatar}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{child.nickname}</div>
                        <div className="text-sm text-gray-500">
                          {child.pinSet ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> PIN 설정됨
                            </span>
                          ) : (
                            <span className="text-gray-400">PIN 미설정</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartSetPin(child.id)}
                          className="rounded-lg"
                        >
                          <KeyRound className="w-4 h-4 mr-1" />
                          {child.pinSet ? '변경' : '설정'}
                        </Button>
                        {child.pinSet && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRemovingPinFor(child.id)}
                            className="rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h4 className="font-medium text-yellow-800 flex items-center gap-2 mb-2">
            <span>💡</span> 아이 로그인 방법
          </h4>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal ml-4">
            <li>아이에게 가족 코드를 알려주세요</li>
            <li>아이의 기기에서 "아이 로그인"을 선택해요</li>
            <li>가족 코드 입력 → 아이 선택 → PIN 입력</li>
            <li>로그인 완료!</li>
          </ol>
        </div>

        {/* 추가 링크 */}
        <div className="mt-6 space-y-3">
          <Link href="/parent/children" className="block">
            <Button variant="outline" className="w-full rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              아이 프로필 관리
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
