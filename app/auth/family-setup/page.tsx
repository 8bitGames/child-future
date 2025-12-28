'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FamilyCodeDisplay } from '@/components/family/FamilyCodeDisplay';

interface FamilyData {
  id: string;
  name: string;
  familyCode: string;
}

export default function FamilySetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<'create' | 'display'>('create');
  const [familyName, setFamilyName] = useState('');
  const [family, setFamily] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user already has a family
  useEffect(() => {
    const checkExistingFamily = async () => {
      try {
        const response = await fetch('/api/family');
        const data = await response.json();

        if (data.success && data.family) {
          // Already has family, show code
          setFamily(data.family);
          setStep('display');
        }
      } catch (err) {
        console.error('Failed to check family:', err);
      } finally {
        setLoading(false);
      }
    };

    checkExistingFamily();
  }, []);

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!familyName.trim()) {
      setError('가족 이름을 입력해주세요.');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/family/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: familyName.trim() })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '가족 생성에 실패했습니다.');
      }

      setFamily(data.family);
      setStep('display');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleContinue = () => {
    router.push('/parent/children');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === 'create' ? '가족 만들기' : '가족 코드가 생성되었어요!'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 'create'
              ? '가족 이름을 입력하고 가족 계정을 만드세요'
              : '아이에게 이 코드를 알려주세요'
            }
          </p>
        </div>

        {step === 'create' ? (
          /* Create Family Form */
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <form onSubmit={handleCreateFamily} className="space-y-6">
              <div>
                <label
                  htmlFor="familyName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  가족 이름
                </label>
                <input
                  type="text"
                  id="familyName"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="예: 김씨네 가족"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors"
                  disabled={creating}
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={creating || !familyName.trim()}
                className={`
                  w-full py-3 px-4 rounded-xl font-medium text-white
                  transition-all duration-200
                  ${creating || !familyName.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
                  }
                `}
              >
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    생성 중...
                  </span>
                ) : (
                  '가족 만들기'
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Display Family Code */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Family Name */}
              <div className="text-center mb-6">
                <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium">
                  {family?.name}
                </span>
              </div>

              {/* Family Code Display */}
              {family && (
                <FamilyCodeDisplay
                  code={family.familyCode}
                  size="large"
                  familyName={family.name}
                />
              )}
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-medium text-yellow-800 flex items-center gap-2">
                <span>💡</span> 이렇게 사용하세요
              </h3>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                <li>• 아이 프로필을 만들고 PIN을 설정하세요</li>
                <li>• 아이에게 가족 코드와 PIN을 알려주세요</li>
                <li>• 아이는 자신의 기기에서 로그인할 수 있어요</li>
              </ul>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            >
              아이 프로필 만들기 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
