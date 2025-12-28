import { Suspense } from 'react';
import { LoginClient } from './LoginClient';

export const dynamic = 'force-dynamic';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="animate-pulse text-indigo-600">로딩 중...</div>
    </div>
  );
}

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginClient redirectTo={redirectTo} />
    </Suspense>
  );
}
