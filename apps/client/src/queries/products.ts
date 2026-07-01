import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const productsQueryKey = ['products'] as const;

const useProducts = (enabled: boolean) =>
  useQuery({
    queryKey: productsQueryKey,
    queryFn: () => trpc.products.list.query(),
    enabled
  });

const recentProductsQueryKey = ['products', 'recent'] as const;

const useRecentProducts = (enabled: boolean) =>
  useQuery({
    queryKey: recentProductsQueryKey,
    queryFn: () => trpc.products.recent.query({ limit: 12 }),
    enabled
  });

export {
  productsQueryKey,
  recentProductsQueryKey,
  useProducts,
  useRecentProducts
};
