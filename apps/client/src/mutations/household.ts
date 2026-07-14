import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { householdQueryKey } from '../queries/household';

// Switching or leaving changes the active household, so ALL household-scoped
// data (catalog, lists, categories, shopping, history) must reload.
const invalidateAll = () => queryClient.invalidateQueries();

const invalidateHousehold = () =>
  queryClient.invalidateQueries({ queryKey: householdQueryKey });

const useSwitchHousehold = () =>
  useMutation({
    mutationFn: (householdId: string) =>
      trpc.household.switch.mutate({ householdId }),
    onSuccess: invalidateAll
  });

const useInviteMember = () =>
  useMutation({
    mutationFn: (email: string) => trpc.household.invite.mutate({ email }),
    onSuccess: invalidateHousehold
  });

const useRemoveMember = () =>
  useMutation({
    mutationFn: (userId: string) =>
      trpc.household.removeMember.mutate({ userId }),
    onSuccess: invalidateHousehold
  });

const useLeaveHousehold = () =>
  useMutation({
    mutationFn: () => trpc.household.leave.mutate(),
    onSuccess: invalidateAll
  });

export {
  useInviteMember,
  useLeaveHousehold,
  useRemoveMember,
  useSwitchHousehold
};
