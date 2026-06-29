import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const baseListsQueryKey = ['base-lists'] as const;
const baseListDetailsQueryKey = (id?: string) => ['base-list', id] as const;

const useBaseLists = (enabled: boolean) =>
  useQuery({
    queryKey: baseListsQueryKey,
    queryFn: () => trpc.baseList.list.query(),
    enabled
  });

const useBaseListDetails = (id: string | undefined, enabled: boolean) =>
  useQuery({
    queryKey: baseListDetailsQueryKey(id),
    queryFn: () => trpc.baseList.get.query({ id: id ?? '' }),
    enabled: enabled && !!id
  });

export {
  baseListDetailsQueryKey,
  baseListsQueryKey,
  useBaseListDetails,
  useBaseLists
};
