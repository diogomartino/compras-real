import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';

const householdQueryKey = ['household'] as const;

const useHouseholdOverview = (enabled: boolean) =>
  useQuery({
    queryKey: householdQueryKey,
    queryFn: () => trpc.household.overview.query(),
    enabled
  });

export { householdQueryKey, useHouseholdOverview };
