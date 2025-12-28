import { Suspense } from 'react';
import { SignupClient } from './SignupClient';

export const dynamic = 'force-dynamic';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="animate-pulse text-indigo-600">로딩 중...</div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignupClient />
    </Suspense>
  );
}
