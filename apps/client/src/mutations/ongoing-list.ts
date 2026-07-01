import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import type { TUnitKind } from '@myapp/shared';
import { useMutation } from '@tanstack/react-query';
import { ongoingListQueryKey } from '../queries/ongoing-list';

type TAddOngoingListItemsInput = {
  productIds: string[];
};

type TUpdateOngoingListItemInput = {
  id: string;
  quantityAmount: number;
  quantityUnit: TUnitKind;
};

const invalidateOngoingList = async () => {
  await queryClient.invalidateQueries({ queryKey: ongoingListQueryKey });
};

const useAddOngoingListItems = () =>
  useMutation({
    mutationFn: (input: TAddOngoingListItemsInput) =>
      trpc.ongoingList.addItems.mutate(input),
    onSuccess: invalidateOngoingList
  });

const useUpdateOngoingListItem = () =>
  useMutation({
    mutationFn: (input: TUpdateOngoingListItemInput) =>
      trpc.ongoingList.updateItem.mutate(input),
    onSuccess: invalidateOngoingList
  });

const useRemoveOngoingListItem = () =>
  useMutation({
    mutationFn: (id: string) => trpc.ongoingList.removeItem.mutate({ id }),
    onSuccess: invalidateOngoingList
  });

export {
  useAddOngoingListItems,
  useRemoveOngoingListItem,
  useUpdateOngoingListItem
};
export type { TAddOngoingListItemsInput, TUpdateOngoingListItemInput };
