import { Suspense } from 'react';
import { FamilySetupClient } from './FamilySetupClient';

export const dynamic = 'force-dynamic';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

export default function FamilySetupPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FamilySetupClient />
    </Suspense>
  );
}
