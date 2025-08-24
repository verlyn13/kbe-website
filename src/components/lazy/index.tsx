'use client';

import { CalendarSkeleton } from '@/components/loading/calendar-skeleton';
import { FormSkeleton } from '@/components/loading/form-skeleton';
import { SkeletonWrapper } from '@/components/loading/skeleton-wrapper';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { createDynamicComponent } from '@/lib/dynamic-import';

// Calendar components
export const LazyEventDialog = createDynamicComponent(
  () => import('@/components/calendar/event-dialog').then((mod) => ({ default: mod.EventDialog })),
  { loading: () => null, ssr: false }
);

// Form components
export const LazyRegistrationFlow = createDynamicComponent(
  () =>
    import('@/components/registration/registration-flow').then((mod) => ({
      default: mod.RegistrationFlow,
    })),
  {
    loading: () => <FormSkeleton fields={6} />,
    ssr: true,
  }
);

export const LazyParentAccountForm = createDynamicComponent(
  () =>
    import('@/components/registration/parent-account').then((mod) => ({
      default: mod.ParentAccountForm,
    })),
  {
    loading: () => <FormSkeleton fields={5} />,
    ssr: true,
  }
);

export const LazyAddStudentsForm = createDynamicComponent(
  () =>
    import('@/components/registration/add-students').then((mod) => ({
      default: mod.AddStudentsForm,
    })),
  {
    loading: () => <FormSkeleton fields={4} />,
    ssr: true,
  }
);

export const LazySelectProgramForm = createDynamicComponent(
  () =>
    import('@/components/registration/select-program').then((mod) => ({
      default: mod.SelectProgramForm,
    })),
  {
    loading: () => <FormSkeleton fields={3} />,
    ssr: true,
  }
);

// Data table for admin
export const LazyDataTable = createDynamicComponent(
  () => import('@/components/admin/announcement-table').then((mod) => ({ default: mod.default })),
  {
    loading: () => <TableSkeleton rows={5} columns={6} />,
    ssr: false,
  }
);

// Dialog components (load concrete component entry points)
export const LazyDialog = createDynamicComponent(
  () => import('@/components/ui/dialog').then((mod) => ({ default: mod.Dialog })),
  { loading: () => null, ssr: false }
);

export const LazyAlertDialog = createDynamicComponent(
  () => import('@/components/ui/alert-dialog').then((mod) => ({ default: mod.AlertDialog })),
  { loading: () => null, ssr: false }
);
