import { Suspense } from 'react';
import { LazyRegistrationFlow } from '@/components/lazy';
import { FormSkeleton } from '@/components/loading/form-skeleton';
import { PublicHeader } from '@/components/public-header';

export default function RegisterPage() {
  return (
    <>
      <PublicHeader />
      <main className="bg-background min-h-screen">
        <div className="container py-8">
          <Suspense fallback={<FormSkeleton fields={6} />}>
            <LazyRegistrationFlow />
          </Suspense>
        </div>
      </main>
    </>
  );
}
