import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const categoriesQueryKey = ['categories'] as const;

const useCategories = (enabled: boolean) =>
  useQuery({
    queryKey: categoriesQueryKey,
    queryFn: () => trpc.categories.list.query(),
    enabled
  });

export { categoriesQueryKey, useCategories };
