import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import type { TUnitKind } from '@myapp/shared';
import { useMutation } from '@tanstack/react-query';
import { productsQueryKey } from '../queries/products';

type TProductInput = {
  title: string;
  imageUrl: string | null;
  categoryName: string | null;
  defaultQuantityAmount: number;
  defaultQuantityUnit: TUnitKind;
  sourceUrl: string | null;
  isArchived: boolean;
};

type TUpdateProductInput = TProductInput & {
  id: string;
};

type TExtractProductDetailsInput = {
  url: string;
};

const invalidateProducts = async () => {
  await queryClient.invalidateQueries({ queryKey: productsQueryKey });
};

const useAddProduct = () =>
  useMutation({
    mutationFn: (input: TProductInput) => trpc.products.add.mutate(input),
    onSuccess: invalidateProducts
  });

const useUpdateProduct = () =>
  useMutation({
    mutationFn: (input: TUpdateProductInput) =>
      trpc.products.update.mutate(input),
    onSuccess: invalidateProducts
  });

const useArchiveProduct = () =>
  useMutation({
    mutationFn: (id: string) => trpc.products.archive.mutate({ id }),
    onSuccess: invalidateProducts
  });

const useRestoreProduct = () =>
  useMutation({
    mutationFn: (id: string) => trpc.products.restore.mutate({ id }),
    onSuccess: invalidateProducts
  });

const useExtractProductDetails = () =>
  useMutation({
    mutationFn: (input: TExtractProductDetailsInput) =>
      trpc.products.extractDetails.mutate(input)
  });

export {
  useAddProduct,
  useArchiveProduct,
  useExtractProductDetails,
  useRestoreProduct,
  useUpdateProduct
};
export type {
  TExtractProductDetailsInput,
  TProductInput,
  TUpdateProductInput
};
