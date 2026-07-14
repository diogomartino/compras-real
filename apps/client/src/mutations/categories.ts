import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import { useMutation } from '@tanstack/react-query';
import { categoriesQueryKey } from '../queries/categories';
import { productsQueryKey } from '../queries/products';

type TCategoryInput = {
  name: string;
};

type TUpdateCategoryInput = TCategoryInput & {
  id: string;
};

const invalidateCategories = async () => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
    queryClient.invalidateQueries({ queryKey: productsQueryKey })
  ]);
};

const useCreateCategory = () =>
  useMutation({
    mutationFn: (input: TCategoryInput) => trpc.categories.create.mutate(input),
    onSuccess: invalidateCategories
  });

const useUpdateCategory = () =>
  useMutation({
    mutationFn: (input: TUpdateCategoryInput) =>
      trpc.categories.update.mutate(input),
    onSuccess: invalidateCategories
  });

const useDeleteCategory = () =>
  useMutation({
    mutationFn: (id: string) => trpc.categories.delete.mutate({ id }),
    onSuccess: invalidateCategories
  });

const useReorderCategories = () =>
  useMutation({
    mutationFn: (orderedIds: string[]) =>
      trpc.categories.reorder.mutate({ orderedIds }),
    onSuccess: invalidateCategories
  });

export {
  useCreateCategory,
  useDeleteCategory,
  useReorderCategories,
  useUpdateCategory
};
export type { TCategoryInput, TUpdateCategoryInput };
