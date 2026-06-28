import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const useGetItemPrice = (marketHashName: string) =>
  useQuery({
    queryKey: ['item-price', marketHashName],
    queryFn: () => trpc.utils.getPrice.query({ marketHashName }),
    enabled: !!marketHashName
  });

export { useGetItemPrice };
