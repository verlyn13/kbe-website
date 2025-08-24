import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonWrapperProps {
  className?: string;
  height?: string;
  width?: string;
  count?: number;
  children?: React.ReactNode;
}

export function SkeletonWrapper({
  className,
  height = 'h-96',
  width = 'w-full',
  count = 1,
  children,
}: SkeletonWrapperProps) {
  if (children) return <>{children}</>;

  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn(height, width)} />
      ))}
    </div>
  );
}
