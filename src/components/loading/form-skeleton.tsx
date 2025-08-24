import { Skeleton } from '@/components/ui/skeleton';

interface FormSkeletonProps {
  fields?: number;
  showButtons?: boolean;
}

export function FormSkeleton({ fields = 4, showButtons = true }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Form title */}
      <Skeleton className="h-8 w-3/4" />

      {/* Form fields */}
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          {i === 0 && <Skeleton className="h-3 w-48 opacity-50" />}
        </div>
      ))}

      {/* Buttons */}
      {showButtons && (
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}
    </div>
  );
}
