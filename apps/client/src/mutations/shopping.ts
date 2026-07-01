import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import type { TOngoingListItemStatus } from '@myapp/shared';
import { useMutation } from '@tanstack/react-query';
import { ongoingListQueryKey } from '../queries/ongoing-list';
import { shoppingListQueryKey } from '../queries/shopping';

type TSetShoppingItemStatusInput = {
  id: string;
  status: TOngoingListItemStatus;
};

const invalidateShoppingState = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: shoppingListQueryKey }),
    queryClient.invalidateQueries({ queryKey: ongoingListQueryKey })
  ]);
};

const clearShoppingListState = async () => {
  await queryClient.cancelQueries({ queryKey: shoppingListQueryKey });
  queryClient.setQueryData(shoppingListQueryKey, undefined);
  queryClient.removeQueries({ queryKey: shoppingListQueryKey });
};

const useStartShopping = () =>
  useMutation({
    mutationFn: () => trpc.shopping.start.mutate(),
    onSuccess: invalidateShoppingState
  });

const useSetShoppingItemStatus = () =>
  useMutation({
    mutationFn: (input: TSetShoppingItemStatusInput) =>
      trpc.shopping.setItemStatus.mutate(input),
    onSuccess: invalidateShoppingState
  });

const useFinishShopping = () =>
  useMutation({
    mutationFn: () => trpc.shopping.finish.mutate(),
    onSuccess: async () => {
      await clearShoppingListState();
      await queryClient.invalidateQueries({ queryKey: ongoingListQueryKey });
    }
  });

const useCancelShopping = () =>
  useMutation({
    mutationFn: () => trpc.shopping.cancel.mutate(),
    onSuccess: async () => {
      await clearShoppingListState();
      await queryClient.invalidateQueries({ queryKey: ongoingListQueryKey });
    }
  });

export {
  clearShoppingListState,
  useCancelShopping,
  useFinishShopping,
  useSetShoppingItemStatus,
  useStartShopping
};
export type { TSetShoppingItemStatusInput };
