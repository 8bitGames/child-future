'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FamilyCodeInput } from '@/components/auth/FamilyCodeInput';
import { ChildSelector } from '@/components/auth/ChildSelector';
import { PinPad } from '@/components/auth/PinPad';
import { FamilyChild, FAMILY_CODE_LENGTH } from '@/lib/types/family';
import { setChildSession, getDeviceFingerprint, parseFamilyCode, isValidFamilyCode } from '@/lib/utils/family-auth';

type LoginStep = 'family-code' | 'select-child' | 'enter-pin';

interface FamilyInfo {
  id: string;
  name: string;
  children: FamilyChild[];
}

function ChildLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [step, setStep] = useState<LoginStep>('family-code');
  const [familyCode, setFamilyCode] = useState('');
  const [family, setFamily] = useState<FamilyInfo | null>(null);
  const [selectedChild, setSelectedChild] = useState<FamilyChild | null>(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  // Handle family code submission
  const handleFamilyCodeSubmit = useCallback(async (code?: string) => {
    const codeToSubmit = code || familyCode;

    if (codeToSubmit.length !== FAMILY_CODE_LENGTH) {
      setError('8자리 코드를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/family/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyCode: codeToSubmit })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '가족을 찾을 수 없습니다.');
      }

      setFamily(data.family);
      setStep('select-child');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setAutoSubmitting(false);
    }
  }, [familyCode]);

  // Check for code in URL params on mount
  useEffect(() => {
    const codeParam = searchParams.get('code');
    if (codeParam) {
      const normalizedCode = parseFamilyCode(codeParam);
      if (isValidFamilyCode(normalizedCode)) {
        setFamilyCode(normalizedCode);
        setAutoSubmitting(true);
      }
    }
  }, [searchParams]);

  // Auto-submit when code is set from URL
  useEffect(() => {
    if (autoSubmitting && familyCode.length === FAMILY_CODE_LENGTH) {
      handleFamilyCodeSubmit(familyCode);
    }
  }, [autoSubmitting, familyCode, handleFamilyCodeSubmit]);

  // Check lockout timer
  useEffect(() => {
    if (!lockoutUntil) return;

    const checkLockout = () => {
      if (new Date(lockoutUntil) <= new Date()) {
        setLockoutUntil(null);
        setError(null);
      }
    };

    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Handle child selection
  const handleChildSelect = (child: FamilyChild) => {
    setSelectedChild(child);
    setPin('');
    setError(null);
    setStep('enter-pin');
  };

  // Handle PIN submission
  const handlePinComplete = async (enteredPin: string) => {
    if (!selectedChild || !family) return;

    setLoading(true);
    setError(null);

    try {
      const deviceFingerprint = getDeviceFingerprint();

      const response = await fetch('/api/auth/child/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyCode,
          childId: selectedChild.id,
          pin: enteredPin,
          deviceFingerprint
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.lockoutUntil) {
          setLockoutUntil(data.lockoutUntil);
        }
        setPin('');
        throw new Error(data.error || 'PIN이 틀렸습니다.');
      }

      // Save session to localStorage
      setChildSession(data.session);

      // Redirect to child home page
      router.push('/child');
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Go back to previous step
  const handleBack = () => {
    setError(null);
    if (step === 'enter-pin') {
      setPin('');
      setSelectedChild(null);
      setStep('select-child');
    } else if (step === 'select-child') {
      setFamily(null);
      setStep('family-code');
    }
  };

  // Render lockout countdown
  const renderLockoutTime = () => {
    if (!lockoutUntil) return null;

    const lockEnd = new Date(lockoutUntil);
    const now = new Date();
    const seconds = Math.max(0, Math.ceil((lockEnd.getTime() - now.getTime()) / 1000));
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="p-4">
        {step !== 'family-code' && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            뒤로
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {['family-code', 'select-child', 'enter-pin'].map((s, index) => (
              <div
                key={s}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${step === s
                    ? 'bg-indigo-500 scale-125'
                    : index < ['family-code', 'select-child', 'enter-pin'].indexOf(step)
                      ? 'bg-indigo-300'
                      : 'bg-gray-300'
                  }
                `}
              />
            ))}
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
            {/* Step 1: Family Code */}
            {step === 'family-code' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl mb-4">🏠</div>
                  <h1 className="text-2xl font-bold text-gray-900">안녕!</h1>
                  <p className="text-gray-600 mt-2">가족 코드를 입력해줘</p>
                </div>

                {/* Auto-submit indicator */}
                {autoSubmitting && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                    <p className="text-indigo-700 text-sm flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      링크에서 코드를 가져오는 중...
                    </p>
                  </div>
                )}

                <FamilyCodeInput
                  value={familyCode}
                  onChange={(v) => {
                    setFamilyCode(v);
                    setError(null);
                  }}
                  error={error || undefined}
                  disabled={loading || autoSubmitting}
                  autoFocus={!autoSubmitting}
                />

                <button
                  onClick={() => handleFamilyCodeSubmit()}
                  disabled={loading || familyCode.length !== FAMILY_CODE_LENGTH}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium text-white
                    transition-all duration-200
                    ${loading || familyCode.length !== FAMILY_CODE_LENGTH
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      확인 중...
                    </span>
                  ) : (
                    '다음 →'
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Select Child */}
            {step === 'select-child' && family && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {family.name}
                  </span>
                </div>

                <ChildSelector
                  children={family.children}
                  selectedId={selectedChild?.id || null}
                  onSelect={handleChildSelect}
                  disabled={loading}
                />

                {error && (
                  <p className="text-center text-sm text-red-600">{error}</p>
                )}
              </div>
            )}

            {/* Step 3: Enter PIN */}
            {step === 'enter-pin' && selectedChild && (
              <div className="space-y-6">
                {/* Selected Child Display */}
                <div className="flex items-center justify-center gap-3 bg-indigo-50 rounded-xl p-3">
                  <span className="text-3xl">{selectedChild.avatar}</span>
                  <span className="text-lg font-bold text-indigo-700">
                    {selectedChild.nickname}
                  </span>
                </div>

                {/* PIN Pad */}
                <PinPad
                  value={pin}
                  onChange={setPin}
                  onComplete={handlePinComplete}
                  disabled={loading || !!lockoutUntil}
                  error={error || undefined}
                  title="PIN을 입력해줘"
                />

                {/* Lockout Display */}
                {lockoutUntil && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-red-700 font-medium">
                      잠시 후 다시 시도해주세요
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-2">
                      {renderLockoutTime()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Parent Login Link */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-gray-500 hover:text-gray-700 text-sm underline"
            >
              부모님 로그인
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400 text-xs">
        아이 진로 탐색
      </footer>
    </div>
  );
}

export default function ChildLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <ChildLoginContent />
    </Suspense>
  );
}
