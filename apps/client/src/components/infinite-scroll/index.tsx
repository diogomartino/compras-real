import { Text } from '@/components/ds';
import Spinner from '@/components/ui/spinner';
import { memo, useEffect, useRef } from 'react';

type TInfiniteScrollProps = {
  hasMore: boolean;
  isLoading: boolean;
  loadingLabel: string;
  endLabel?: string;
  onLoadMore: () => void;
};

const InfiniteScroll = memo(
  ({
    hasMore,
    isLoading,
    loadingLabel,
    endLabel,
    onLoadMore
  }: TInfiniteScrollProps) => {
    const markerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const marker = markerRef.current;

      if (!marker || !hasMore || isLoading) {
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            onLoadMore();
          }
        },
        { rootMargin: '192px' }
      );

      observer.observe(marker);

      return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

    return (
      <div ref={markerRef} className="flex justify-center py-3 text-center">
        {isLoading && (
          <Spinner size="xs" aria-label={loadingLabel} />
        )}
        {!hasMore && endLabel && !isLoading && (
          <Text size="sm" tone="subtle">
            {endLabel}
          </Text>
        )}
      </div>
    );
  }
);

InfiniteScroll.displayName = 'InfiniteScroll';

export { InfiniteScroll };
export type { TInfiniteScrollProps };
