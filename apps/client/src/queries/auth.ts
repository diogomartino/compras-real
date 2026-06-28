import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const useGetAuthedUser = (enabled: boolean) =>
  useQuery({
    queryKey: ['authed-user'],
    queryFn: () => trpc.auth.getUser.query(),
    enabled
  });

export { useGetAuthedUser };
