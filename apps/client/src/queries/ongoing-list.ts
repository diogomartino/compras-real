import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const ongoingListQueryKey = ['ongoing-list'] as const;

const useOngoingList = (enabled: boolean) =>
  useQuery({
    queryKey: ongoingListQueryKey,
    queryFn: () => trpc.ongoingList.get.query(),
    enabled
  });

export { ongoingListQueryKey, useOngoingList };
