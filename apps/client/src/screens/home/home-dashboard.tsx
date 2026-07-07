import { AppBottomNav } from '@/components/app-bottom-nav';
import { Inline, Stack, Surface, Text } from '@/components/ds';
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
import { useProducts, useRecentProducts } from '@/queries/products';
import type { TOngoingListEntry, TUnitKind } from '@myapp/shared';
import { PackagePlus, Plus, Search, ShoppingBasket } from 'lucide-react';
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
  const groups = useMemo(
    () => getGroupedOngoingListItems(visibleItems, t('common.uncategorized')),
    [t, visibleItems]
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
        toast.success(t('home.productRemoved'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('home.failedToRemoveProduct')
        );
      }
    },
    [removeItem, t]
  );

  return (
    <main className="min-h-dvh bg-background pb-24 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Surface variant="default" radius="xl" padding="md" className="bg-card/85">
          <Stack gap="md">
            <Inline justify="between" className="gap-3" wrap={false}>
              <Inline gap="sm" wrap={false} className="min-w-0">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ShoppingBasket className="size-5" />
                </div>
                <Stack gap="none" className="min-w-0">
                  <Text weight="semibold" className="truncate">
                    {t('home.currentList')}
                  </Text>
                  <Text size="sm" tone="muted" className="truncate">
                    {t('home.productsReady', { count: items.length })}
                  </Text>
                </Stack>
              </Inline>
              <Button
                type="button"
                className="shrink-0"
                onClick={openAddDialog}
              >
                <Plus className="size-4" />
                <span className="sr-only sm:not-sr-only">
                  {t('home.addProducts')}
                </span>
              </Button>
            </Inline>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={onQueryChange}
                className="pl-9"
                placeholder={t('home.searchOngoingProducts')}
              />
            </div>
          </Stack>
        </Surface>

        {ongoingListError && (
          <Surface radius="xl" padding="md" variant="muted">
            <Text tone="destructive">{ongoingListError.message}</Text>
          </Surface>
        )}

        {ongoingListLoading && (
          <Surface radius="xl" padding="lg">
            <Text tone="muted">{t('home.loadingOngoingList')}</Text>
          </Surface>
        )}

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
                {group.items.map((item) => (
                  <OngoingListItemRow
                    key={item.id}
                    item={item}
                    isMutating={isMutating}
                    onEdit={editItem}
                    onRemove={remove}
                  />
                ))}
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
      <AppBottomNav />
    </main>
  );
});

HomeDashboard.displayName = 'HomeDashboard';

export { HomeDashboard };
