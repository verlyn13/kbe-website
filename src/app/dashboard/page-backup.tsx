import { QuickCheck } from '@/components/quick-check';
import { Announcements } from '@/components/announcements';
import { SessionCalendar } from '@/components/session-calendar';
import { WeeklyChallenges } from '@/components/weekly-challenges';
import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Suspense fallback={<Skeleton className="h-[220px] w-full" />}>
            <QuickCheck />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <Announcements />
          </Suspense>
        </div>
        <div className="lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <SessionCalendar />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <WeeklyChallenges />
          </Suspense>
        </div>
      </div>
    </div>
  );
}