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

const useDeleteProduct = () =>
  useMutation({
    mutationFn: (id: string) => trpc.products.delete.mutate({ id }),
    onSuccess: invalidateProducts
  });

const useExtractProductDetails = () =>
  useMutation({
    mutationFn: (input: TExtractProductDetailsInput) =>
      trpc.products.extractDetails.mutate(input)
  });

export {
  useAddProduct,
  useDeleteProduct,
  useExtractProductDetails,
  useUpdateProduct
};
export type { TExtractProductDetailsInput, TProductInput, TUpdateProductInput };
