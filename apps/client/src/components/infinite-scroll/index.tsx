import { Text } from '@/components/ds';
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
      <div ref={markerRef} className="py-3 text-center">
        {isLoading && (
          <Text size="sm" tone="muted">
            {loadingLabel}
          </Text>
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
