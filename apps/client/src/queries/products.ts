import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const productsQueryKey = ['products'] as const;

const useProducts = (enabled: boolean) =>
  useQuery({
    queryKey: productsQueryKey,
    queryFn: () => trpc.products.list.query(),
    enabled
  });

export { productsQueryKey, useProducts };
