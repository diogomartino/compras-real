import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import type { TUnitKind } from '@myapp/shared';
import { useMutation } from '@tanstack/react-query';
import {
  baseListDetailsQueryKey,
  baseListsQueryKey
} from '../queries/base-list';

type TBaseListInput = {
  name: string;
  isEnabled: boolean;
};

type TUpdateBaseListInput = TBaseListInput & {
  id: string;
};

type TBaseListItemInput = {
  baseListId: string;
  productId: string;
  quantityAmount: number;
  quantityUnit: TUnitKind;
};

type TUpdateBaseListItemInput = {
  id: string;
  baseListId: string;
  quantityAmount: number;
  quantityUnit: TUnitKind;
};

const invalidateBaseLists = async () => {
  await queryClient.invalidateQueries({ queryKey: baseListsQueryKey });
};

const invalidateBaseListDetails = async (baseListId: string) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: baseListsQueryKey }),
    queryClient.invalidateQueries({
      queryKey: baseListDetailsQueryKey(baseListId)
    })
  ]);
};

const useCreateBaseList = () =>
  useMutation({
    mutationFn: (input: TBaseListInput) => trpc.baseList.create.mutate(input),
    onSuccess: invalidateBaseLists
  });

const useUpdateBaseList = () =>
  useMutation({
    mutationFn: (input: TUpdateBaseListInput) =>
      trpc.baseList.update.mutate(input),
    onSuccess: invalidateBaseLists
  });

const useRemoveBaseList = () =>
  useMutation({
    mutationFn: (id: string) => trpc.baseList.remove.mutate({ id }),
    onSuccess: invalidateBaseLists
  });

const useAddBaseListItem = () =>
  useMutation({
    mutationFn: (input: TBaseListItemInput) =>
      trpc.baseList.addItem.mutate(input),
    onSuccess: (_data, variables) =>
      invalidateBaseListDetails(variables.baseListId)
  });

const useUpdateBaseListItem = () =>
  useMutation({
    mutationFn: (input: TUpdateBaseListItemInput) =>
      trpc.baseList.updateItem.mutate({
        id: input.id,
        quantityAmount: input.quantityAmount,
        quantityUnit: input.quantityUnit
      }),
    onSuccess: (_data, variables) =>
      invalidateBaseListDetails(variables.baseListId)
  });

const useRemoveBaseListItem = () =>
  useMutation({
    mutationFn: (input: { id: string; baseListId: string }) =>
      trpc.baseList.removeItem.mutate({ id: input.id }),
    onSuccess: (_data, variables) =>
      invalidateBaseListDetails(variables.baseListId)
  });

export {
  useAddBaseListItem,
  useCreateBaseList,
  useRemoveBaseList,
  useRemoveBaseListItem,
  useUpdateBaseList,
  useUpdateBaseListItem
};
export type {
  TBaseListInput,
  TBaseListItemInput,
  TUpdateBaseListInput,
  TUpdateBaseListItemInput
};
