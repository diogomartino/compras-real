import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { memo } from 'react';

type TListSkeletonProps = {
  rows?: number;
  className?: string;
};

/**
 * Placeholder rows matching the shape of a ListRow / item card, shown while
 * list data loads. Replaces plain "Loading…" text to avoid a layout shift.
 */
const ListSkeleton = memo(({ rows = 5, className }: TListSkeletonProps) => {
  return (
    <div
      className={cn('space-y-3', className)}
      role="status"
      aria-busy="true"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/60 p-3"
        >
          <Skeleton className="size-12 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="size-9 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
});

ListSkeleton.displayName = 'ListSkeleton';

export { ListSkeleton };
export type { TListSkeletonProps };
