import { Suspense } from 'react';
import { ChildLoginClient } from './ChildLoginClient';

export const dynamic = 'force-dynamic';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function ChildLoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialCode = params.code;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChildLoginClient initialCode={initialCode} />
    </Suspense>
  );
}
