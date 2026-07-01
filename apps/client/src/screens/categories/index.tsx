import { AppBottomNav } from '@/components/app-bottom-nav';
import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import {
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory
} from '@/mutations/categories';
import { useCategories } from '@/queries/categories';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import { ArrowLeft, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

type TCategoryForm = {
  name: string;
};

type TEditingCategory = {
  id: string;
  name: string;
};

const Categories = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [editingCategory, setEditingCategory] = useState<TEditingCategory>();
  const { data, isLoading, error } = useCategories(isAuthenticated);
  const { mutateAsync: createCategory, isPending: createPending } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: updatePending } =
    useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: deletePending } =
    useDeleteCategory();
  const { values, errors, setErrors, resetErrors, r, setValues } =
    useForm<TCategoryForm>({ name: '' });
  const categories = useMemo(() => data ?? [], [data]);
  const isPending = createPending || updatePending || deletePending;

  const resetForm = useCallback(() => {
    setEditingCategory(undefined);
    setValues({ name: '' });
    resetErrors();
  }, [resetErrors, setValues]);
  const edit = useCallback(
    (category: TEditingCategory) => {
      setEditingCategory(category);
      setValues({ name: category.name });
      resetErrors();
    },
    [resetErrors, setValues]
  );
  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetErrors();

      try {
        if (editingCategory) {
          await updateCategory({ id: editingCategory.id, name: values.name });
          toast.success('Category updated.');
        } else {
          await createCategory({ name: values.name });
          toast.success('Category created.');
        }

        resetForm();
      } catch (mutationError) {
        setErrors(parseTrpcErrors(mutationError));
      }
    },
    [
      createCategory,
      editingCategory,
      resetErrors,
      resetForm,
      setErrors,
      updateCategory,
      values.name
    ]
  );
  const remove = useCallback(
    async (category: TEditingCategory) => {
      const confirmed = await requestConfirmation({
        title: 'Delete category?',
        message: `Delete ${category.name}? Products in it will become uncategorized.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await deleteCategory(category.id);
        toast.success('Category deleted.');
        if (editingCategory?.id === category.id) {
          resetForm();
        }
      } catch (mutationError) {
        toast.error(
          parseTrpcErrors(mutationError)._general ??
            'Failed to delete category.'
        );
      }
    },
    [deleteCategory, editingCategory?.id, resetForm]
  );

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Inline justify="between" wrap={false} className="gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/catalog')}
          >
            <ArrowLeft className="size-4" />
            Catalog
          </Button>
          <Text weight="semibold">Categories</Text>
        </Inline>

        <Surface radius="2xl" padding="lg">
          <form className="space-y-4" onSubmit={submit}>
            <Stack gap="xs">
              <Text weight="semibold">
                {editingCategory ? 'Edit category' : 'Create category'}
              </Text>
              <Text size="sm" tone="muted">
                Categories organize catalog products and shopping mode groups.
              </Text>
            </Stack>
            {errors._general && (
              <Text size="sm" tone="destructive" role="alert">
                {errors._general}
              </Text>
            )}
            <Input
              {...r('name')}
              error={errors.name}
              className="h-11 rounded-xl"
              placeholder="Dairy"
              disabled={isPending}
            />
            <Inline justify="end">
              {editingCategory && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel edit
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                <FolderPlus className="size-4" />
                {editingCategory ? 'Save category' : 'Create category'}
              </Button>
            </Inline>
          </form>
        </Surface>

        {error && (
          <Surface radius="2xl" padding="md" variant="muted">
            <Text tone="destructive">{error.message}</Text>
          </Surface>
        )}

        <Stack gap="sm">
          {isLoading && (
            <Surface radius="2xl" padding="lg">
              <Text tone="muted">Loading categories...</Text>
            </Surface>
          )}
          {!isLoading && categories.length === 0 && (
            <Surface radius="2xl" padding="lg" className="text-center">
              <Text tone="muted">No categories yet.</Text>
            </Surface>
          )}
          {categories.map((category) => (
            <Surface key={category.id} radius="2xl" padding="md">
              <Inline justify="between" wrap={false} className="gap-3">
                <Stack gap="none" className="min-w-0">
                  <Text weight="semibold" className="truncate">
                    {category.name}
                  </Text>
                  <Text size="sm" tone="muted">
                    {category.productCount} products
                  </Text>
                </Stack>
                <Inline gap="xs" wrap={false}>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    disabled={isPending}
                    onClick={() => edit(category)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    disabled={isPending}
                    onClick={() => {
                      void remove(category);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </Inline>
              </Inline>
            </Surface>
          ))}
        </Stack>
      </div>
      <AppBottomNav />
    </main>
  );
});

Categories.displayName = 'Categories';

export { Categories };
