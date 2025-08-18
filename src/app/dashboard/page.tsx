import { StudentRoster } from '@/components/portal/student-roster';
import { MathCountsSchedule } from '@/components/portal/mathcounts-schedule';
import { UpcomingCompetitions } from '@/components/portal/upcoming-competitions';
import { QuickLinks } from '@/components/portal/quick-links';
import { Announcements } from '@/components/announcements';
import { WelcomeGuide } from '@/components/portal/welcome-guide';
import { WaiverStatusWidget } from '@/components/waiver-status-widget';
import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 px-4 sm:px-0">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guardian Portal</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your family's enrichment program information.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <WelcomeGuide />
      </Suspense>

      {/* Waiver Status Widget - Prominent placement */}
      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <WaiverStatusWidget />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <StudentRoster />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
            <MathCountsSchedule />
          </Suspense>
        </div>

        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <Announcements />
          </Suspense>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
            <UpcomingCompetitions />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[250px] w-full" />}>
            <QuickLinks />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
