import { Inline, ListSkeleton, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import {
  useAddOngoingListItems,
  useRemoveOngoingListItem,
  useUpdateOngoingListItem
} from '@/mutations/ongoing-list';
import { useOngoingList } from '@/queries/ongoing-list';
import { useCategories } from '@/queries/categories';
import {
  useProducts,
  useRecentProducts,
  useSuggestedProducts
} from '@/queries/products';
import type { TOngoingListEntry, TUnitKind } from '@myapp/shared';
import { PackagePlus, Plus } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent
} from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AddProductsDialog } from './add-products-dialog';
import { EditOngoingItemDialog } from './edit-ongoing-item-dialog';
import { getGroupedOngoingListItems } from './helpers';
import { OngoingListItemRow } from './ongoing-list-item-row';

const HomeDashboard = memo(() => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TOngoingListEntry>();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    data: ongoingList,
    error: ongoingListError,
    isLoading: ongoingListLoading
  } = useOngoingList(true);
  const { data: productsData, isLoading: productsLoading } = useProducts(true);
  const { data: recentProductsData } = useRecentProducts(addDialogOpen);
  const { data: suggestedProductsData } = useSuggestedProducts(true);
  const { data: categoriesData } = useCategories(true);
  const { mutateAsync: addItems, isPending: addItemsPending } =
    useAddOngoingListItems();
  const { mutateAsync: updateItem, isPending: updateItemPending } =
    useUpdateOngoingListItem();
  const { mutateAsync: removeItem, isPending: removeItemPending } =
    useRemoveOngoingListItem();

  const items = useMemo(() => ongoingList?.items ?? [], [ongoingList]);
  const products = useMemo(() => productsData ?? [], [productsData]);
  const recentProducts = useMemo(
    () => recentProductsData ?? [],
    [recentProductsData]
  );
  const suggestedProducts = useMemo(
    () => suggestedProductsData ?? [],
    [suggestedProductsData]
  );
  const visibleSuggestions = useMemo(() => {
    const ongoingProductIds = new Set(items.map((item) => item.productId));

    return suggestedProducts
      .filter((product) => !ongoingProductIds.has(product.id))
      .slice(0, 6);
  }, [items, suggestedProducts]);
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      `${item.title} ${item.categoryName ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [items, query]);
  const categoryOrder = useMemo(
    () => (categoriesData ?? []).map((category) => category.name),
    [categoriesData]
  );
  const groups = useMemo(
    () =>
      getGroupedOngoingListItems(
        visibleItems,
        t('common.uncategorized'),
        categoryOrder
      ),
    [categoryOrder, t, visibleItems]
  );
  const isMutating = useMemo(
    () => addItemsPending || updateItemPending || removeItemPending,
    [addItemsPending, removeItemPending, updateItemPending]
  );

  useEffect(() => {
    if (searchParams.get('addProducts') !== '1') {
      return;
    }

    setAddDialogOpen(true);
    setSearchParams((currentParams) => {
      currentParams.delete('addProducts');
      return currentParams;
    });
  }, [searchParams, setSearchParams]);

  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);
  const openAddDialog = useCallback(() => {
    setAddDialogOpen(true);
  }, []);
  const editItem = useCallback((item: TOngoingListEntry) => {
    setEditingItem(item);
  }, []);
  const closeEditDialog = useCallback(() => {
    setEditingItem(undefined);
  }, []);
  const addSelectedProducts = useCallback(
    async (productIds: string[]) => {
      try {
        await addItems({ productIds });
        setAddDialogOpen(false);
        toast.success(t('home.productsAdded'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('home.failedToAddProducts')
        );
      }
    },
    [addItems, t]
  );
  const addSuggestion = useCallback(
    async (productId: string) => {
      try {
        await addItems({ productIds: [productId] });
        toast.success(t('home.productsAdded'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('home.failedToAddProducts')
        );
      }
    },
    [addItems, t]
  );
  const updateQuantity = useCallback(
    async (input: {
      id: string;
      quantityAmount: number;
      quantityUnit: TUnitKind;
    }) => {
      try {
        await updateItem(input);
        setEditingItem(undefined);
        toast.success(t('home.quantityUpdated'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('home.failedToUpdateQuantity')
        );
      }
    },
    [t, updateItem]
  );
  const changeItemQuantity = useCallback(
    async (item: TOngoingListEntry, quantityAmount: number) => {
      try {
        await updateItem({
          id: item.id,
          quantityAmount,
          quantityUnit: item.quantityUnit
        });
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('home.failedToUpdateQuantity')
        );
      }
    },
    [t, updateItem]
  );
  const remove = useCallback(
    async (item: TOngoingListEntry) => {
      const confirmed = await requestConfirmation({
        title: t('home.removeProductTitle'),
        message: t('home.removeProductMessage', { title: item.title }),
        confirmLabel: t('common.remove'),
        cancelLabel: t('common.cancel'),
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await removeItem(item.id);
        toast(t('home.productRemoved'), {
          action: {
            label: t('common.undo'),
            onClick: async () => {
              try {
                const details = await addItems({ productIds: [item.productId] });
                const restored = details?.items.find(
                  (currentItem) => currentItem.productId === item.productId
                );

                if (
                  restored &&
                  (restored.quantityAmount !== item.quantityAmount ||
                    restored.quantityUnit !== item.quantityUnit)
                ) {
                  await updateItem({
                    id: restored.id,
                    quantityAmount: item.quantityAmount,
                    quantityUnit: item.quantityUnit
                  });
                }
              } catch (undoError) {
                toast.error(
                  parseTrpcErrors(undoError)._general ??
                    t('home.failedToAddProducts')
                );
              }
            }
          }
        });
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('home.failedToRemoveProduct')
        );
      }
    },
    [addItems, removeItem, updateItem, t]
  );

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Surface variant="default" radius="xl" padding="md" className="bg-card/85">
          <Inline justify="between" className="gap-3" wrap={false}>
            <Input
              value={query}
              onChange={onQueryChange}
              placeholder={t('home.searchOngoingProducts')}
            />
            <Button
              type="button"
              size="icon"
              className="shrink-0"
              onClick={openAddDialog}
              aria-label={t('home.addProducts')}
            >
              <Plus className="size-5" />
            </Button>
          </Inline>
        </Surface>

        {!query.trim() && visibleSuggestions.length > 0 && (
          <Stack gap="xs">
            <Text size="sm" weight="semibold" tone="muted" className="px-1">
              {t('home.suggestionsTitle')}
            </Text>
            <div className="flex flex-wrap gap-2">
              {visibleSuggestions.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  disabled={isMutating}
                  onClick={() => addSuggestion(product.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/75 py-1.5 pl-3 pr-1.5 text-sm font-medium transition-colors active:bg-accent/40 disabled:opacity-50"
                >
                  <span className="max-w-40 truncate">{product.title}</span>
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Plus className="size-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </Stack>
        )}

        {ongoingListError && (
          <Surface radius="xl" padding="md" variant="muted">
            <Text tone="destructive">{ongoingListError.message}</Text>
          </Surface>
        )}

        {ongoingListLoading && <ListSkeleton />}

        {!ongoingListLoading && visibleItems.length === 0 && (
          <Surface radius="xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <PackagePlus className="size-8 text-muted-foreground" />
              <Text weight="semibold">{t('home.noProductsInOngoingList')}</Text>
              <Text size="sm" tone="muted">
                {t('home.addProductsFromCatalog')}
              </Text>
              <Button
                type="button"
                className="mt-2"
                onClick={openAddDialog}
              >
                <Plus className="size-4" />
                {t('home.addProducts')}
              </Button>
            </Stack>
          </Surface>
        )}

        {!ongoingListLoading && visibleItems.length > 0 && (
          <Stack gap="lg">
            {groups.map((group) => (
              <Stack key={group.categoryName} gap="sm">
                <Inline justify="between" className="px-1">
                  <Text weight="semibold">{group.categoryName}</Text>
                  <Text size="sm" tone="muted">
                    {group.items.length} {t('common.items')}
                  </Text>
                </Inline>
                <AnimatePresence initial={false} mode="popLayout">
                  {group.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.95, x: -24 }
                      }
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <OngoingListItemRow
                        item={item}
                        isMutating={isMutating}
                        onEdit={editItem}
                        onRemove={remove}
                        onQuantityChange={changeItemQuantity}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            ))}
          </Stack>
        )}

        {!productsLoading && products.length === 0 && (
          <Surface variant="muted" radius="xl" padding="md">
            <Inline justify="between" wrap={false}>
              <Stack gap="xs">
                <Text weight="semibold">{t('home.catalogIsEmpty')}</Text>
                <Text size="sm" tone="muted">
                  {t('home.addCatalogProductsBefore')}
                </Text>
              </Stack>
            </Inline>
          </Surface>
        )}
      </div>

      <AddProductsDialog
        open={addDialogOpen}
        products={products}
        recentProducts={recentProducts}
        suggestedProducts={suggestedProducts}
        ongoingItems={items}
        isPending={addItemsPending}
        onOpenChange={setAddDialogOpen}
        onSubmit={addSelectedProducts}
      />
      <EditOngoingItemDialog
        item={editingItem}
        isPending={updateItemPending}
        onClose={closeEditDialog}
        onSubmit={updateQuantity}
      />
    </main>
  );
});

HomeDashboard.displayName = 'HomeDashboard';

export { HomeDashboard };
