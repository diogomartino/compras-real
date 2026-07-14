import { Inline, ListSkeleton, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import {
  useCreateCategory,
  useDeleteCategory,
  useReorderCategories,
  useUpdateCategory
} from '@/mutations/categories';
import { useCategories } from '@/queries/categories';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import {
  ArrowLeft,
  FolderPlus,
  GripVertical,
  Pencil,
  Trash2
} from 'lucide-react';
import { Reorder, useDragControls } from 'motion/react';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

type TCategoryForm = {
  name: string;
};

type TEditingCategory = {
  id: string;
  name: string;
};

type TCategory = {
  id: string;
  name: string;
  position: number;
  productCount: number;
  createdAt: number;
  updatedAt: number;
};

type TCategoryRowProps = {
  category: TCategory;
  disabled: boolean;
  productCountLabel: string;
  editLabel: string;
  deleteLabel: string;
  reorderLabel: string;
  onEdit: (category: TEditingCategory) => void;
  onRemove: (category: TEditingCategory) => void;
  onCommit: () => void;
};

const CategoryRow = memo(
  ({
    category,
    disabled,
    productCountLabel,
    editLabel,
    deleteLabel,
    reorderLabel,
    onEdit,
    onRemove,
    onCommit
  }: TCategoryRowProps) => {
    const controls = useDragControls();

    return (
      <Reorder.Item
        value={category}
        dragListener={false}
        dragControls={controls}
        onDragEnd={onCommit}
      >
        <Surface radius="xl" padding="md">
          <Inline justify="between" wrap={false} className="gap-3">
            <Inline gap="sm" wrap={false} className="min-w-0">
              <button
                type="button"
                aria-label={reorderLabel}
                className="grid size-9 shrink-0 cursor-grab touch-none place-items-center rounded-lg text-muted-foreground active:cursor-grabbing"
                onPointerDown={(event) => controls.start(event)}
              >
                <GripVertical className="size-5" />
              </button>
              <Stack gap="none" className="min-w-0">
                <Text weight="semibold" className="truncate">
                  {category.name}
                </Text>
                <Text size="sm" tone="muted">
                  {productCountLabel}
                </Text>
              </Stack>
            </Inline>
            <Inline gap="xs" wrap={false}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                aria-label={editLabel}
                onClick={() =>
                  onEdit({ id: category.id, name: category.name })
                }
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={disabled}
                aria-label={deleteLabel}
                onClick={() =>
                  onRemove({ id: category.id, name: category.name })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </Inline>
          </Inline>
        </Surface>
      </Reorder.Item>
    );
  }
);

CategoryRow.displayName = 'CategoryRow';

const Categories = memo(() => {
  const { t } = useTranslation();
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
  const { mutateAsync: reorderCategories, isPending: reorderPending } =
    useReorderCategories();
  const { values, errors, setErrors, resetErrors, r, setValues } =
    useForm<TCategoryForm>({ name: '' });
  const categories = useMemo(() => data ?? [], [data]);
  const isPending = createPending || updatePending || deletePending;
  const [orderedCategories, setOrderedCategories] = useState(categories);

  // Keep local drag order in sync with the server unless we're mid-reorder.
  useEffect(() => {
    setOrderedCategories(categories);
  }, [categories]);

  const commitOrder = useCallback(() => {
    const orderedIds = orderedCategories.map((category) => category.id);
    const currentIds = categories.map((category) => category.id);

    if (orderedIds.join(',') === currentIds.join(',')) {
      return;
    }

    reorderCategories(orderedIds).catch((reorderError) => {
      toast.error(
        parseTrpcErrors(reorderError)._general ??
          t('categories.failedToReorder')
      );
    });
  }, [categories, orderedCategories, reorderCategories, t]);

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
          toast.success(t('categories.categoryUpdated'));
        } else {
          await createCategory({ name: values.name });
          toast.success(t('categories.categoryCreated'));
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
      t,
      updateCategory,
      values.name
    ]
  );
  const remove = useCallback(
    async (category: TEditingCategory) => {
      const confirmed = await requestConfirmation({
        title: t('categories.deleteTitle'),
        message: t('categories.deleteMessage', { name: category.name }),
        confirmLabel: t('common.delete'),
        cancelLabel: t('common.cancel'),
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await deleteCategory(category.id);
        toast.success(t('categories.categoryDeleted'));
        if (editingCategory?.id === category.id) {
          resetForm();
        }
      } catch (mutationError) {
        toast.error(
          parseTrpcErrors(mutationError)._general ??
            t('categories.failedToDeleteCategory')
        );
      }
    },
    [deleteCategory, editingCategory?.id, resetForm, t]
  );

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Inline justify="between" wrap={false} className="gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/catalog')}
          >
            <ArrowLeft className="size-4" />
            {t('categories.catalog')}
          </Button>
          <Text weight="semibold">{t('categories.title')}</Text>
        </Inline>

        <Surface radius="xl" padding="lg">
          <form className="space-y-4" onSubmit={submit}>
            <Stack gap="xs">
              <Text weight="semibold">
                {editingCategory
                  ? t('categories.editCategory')
                  : t('categories.createCategory')}
              </Text>
              <Text size="sm" tone="muted">
                {t('categories.description')}
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
              placeholder={t('categories.placeholder')}
              disabled={isPending}
            />
            <Inline justify="end">
              {editingCategory && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  {t('categories.cancelEdit')}
                </Button>
              )}
              <Button type="submit" disabled={isPending}>
                <FolderPlus className="size-4" />
                {editingCategory
                  ? t('categories.saveCategory')
                  : t('categories.createCategory')}
              </Button>
            </Inline>
          </form>
        </Surface>

        {error && (
          <Surface radius="xl" padding="md" variant="muted">
            <Text tone="destructive">{error.message}</Text>
          </Surface>
        )}

        <Stack gap="sm">
          {isLoading && <ListSkeleton />}
          {!isLoading && categories.length === 0 && (
            <Surface radius="xl" padding="lg" className="text-center">
              <Text tone="muted">{t('categories.empty')}</Text>
            </Surface>
          )}
          {!isLoading && categories.length > 0 && (
            <Text size="sm" tone="muted" className="px-1">
              {t('categories.reorderHint')}
            </Text>
          )}
          <Reorder.Group
            as="div"
            axis="y"
            values={orderedCategories}
            onReorder={setOrderedCategories}
            className="space-y-2"
          >
            {orderedCategories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                disabled={isPending || reorderPending}
                productCountLabel={t('categories.productCount', {
                  count: category.productCount
                })}
                editLabel={t('common.edit')}
                deleteLabel={t('common.delete')}
                reorderLabel={t('categories.reorderHint')}
                onEdit={edit}
                onRemove={remove}
                onCommit={commitOrder}
              />
            ))}
          </Reorder.Group>
        </Stack>
      </div>
    </main>
  );
});

Categories.displayName = 'Categories';

export { Categories };
