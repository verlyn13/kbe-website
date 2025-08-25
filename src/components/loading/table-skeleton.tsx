import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  const headerKeys = useMemo(
    () => Array.from({ length: columns }, (_, i) => `col-${i}`),
    [columns]
  );
  const rowKeys = useMemo(() => Array.from({ length: rows }, (_, i) => `row-${i}`), [rows]);
  return (
    <div className="w-full">
      {/* Table header */}
      <div className="border-b">
        <div className="flex gap-4 p-4">
          {headerKeys.map((key) => (
            <Skeleton key={key} className="h-4 flex-1" />
          ))}
        </div>
      </div>

      {/* Table rows */}
      {rowKeys.map((rowKey, rowIndex) => (
        <div key={rowKey} className="border-b">
          <div className="flex gap-4 p-4">
            {headerKeys.map((colKey, colIndex) => (
              <Skeleton
                key={`${rowKey}-${colKey}`}
                className="h-4 flex-1"
                style={{
                  width: colIndex === 0 ? '40%' : '20%',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
