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

const suggestedProductsQueryKey = ['products', 'suggestions'] as const;

const useSuggestedProducts = (enabled: boolean) =>
  useQuery({
    queryKey: suggestedProductsQueryKey,
    queryFn: () => trpc.products.suggestions.query({ limit: 8 }),
    enabled
  });

const useStoreSearch = (query: string, enabled: boolean) => {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['products', 'store-search', trimmed],
    queryFn: () => trpc.products.search.query({ query: trimmed }),
    enabled: enabled && trimmed.length >= 2,
    staleTime: 60 * 60 * 1000
  });
};

export {
  productsQueryKey,
  recentProductsQueryKey,
  suggestedProductsQueryKey,
  useProducts,
  useRecentProducts,
  useStoreSearch,
  useSuggestedProducts
};
