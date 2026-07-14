import {
  Inline,
  ProgressSummary,
  Stack,
  Stat,
  Surface,
  Text
} from '@/components/ds';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { useAuth } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useWakeLock } from '@/hooks/use-wake-lock';
import { queryClient } from '@/lib/query-client';
import { cn } from '@/lib/utils';
import { useUpdateSettings } from '@/mutations/auth';
import { useAddOngoingListItems } from '@/mutations/ongoing-list';
import {
  clearShoppingListState,
  useCancelShopping,
  useFinishShopping,
  useSetShoppingItemStatus
} from '@/mutations/shopping';
import { useCategories } from '@/queries/categories';
import {
  useProducts,
  useRecentProducts,
  useSuggestedProducts
} from '@/queries/products';
import {
  type TShoppingActivity,
  type TShoppingPresenceUser,
  shoppingListQueryKey,
  useShoppingList,
  useShoppingUpdates
} from '@/queries/shopping';
import { AddProductsDialog } from '@/screens/home/add-products-dialog';
import type { TOngoingListEntry, TOngoingListItemStatus } from '@myapp/shared';
import {
  CheckCircle2,
  Hand,
  List,
  Plus,
  RotateCcw,
  ShoppingCart
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { playActionTone, vibrate } from './helpers';
import { ShoppingListView } from './shopping-list-view';
import { ShoppingLiveStatus } from './shopping-live-status';
import { ShoppingProgress } from './shopping-progress';
import { ShoppingSwipeView } from './shopping-swipe-view';

type TShoppingView = 'list' | 'swipe';

const Shopping = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const auth = useAuth();
  const [view, setView] = useState<TShoppingView>(
    auth.settings?.defaultShoppingMode ?? 'list'
  );
  const [reviewSkipped, setReviewSkipped] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [shoppingUsers, setShoppingUsers] = useState<TShoppingPresenceUser[]>([]);
  const [shoppingActivities, setShoppingActivities] = useState<
    TShoppingActivity[]
  >([]);
  const hapticsUnsupportedToastShown = useRef(false);
  const { data: shoppingList, isLoading, error } = useShoppingList(true);
  const { mutateAsync: setItemStatus, isPending: setItemStatusPending } =
    useSetShoppingItemStatus();
  const { mutateAsync: finishShopping, isPending: finishShoppingPending } =
    useFinishShopping();
  const { mutateAsync: cancelShopping, isPending: cancelShoppingPending } =
    useCancelShopping();
  const { mutateAsync: updateSettings, isPending: updateSettingsPending } =
    useUpdateSettings();
  const { mutateAsync: addProducts, isPending: addProductsPending } =
    useAddOngoingListItems();
  const { data: productsData } = useProducts(true);
  const { data: recentProductsData } = useRecentProducts(addDialogOpen);
  const { data: suggestedProductsData } = useSuggestedProducts(addDialogOpen);
  const { data: categoriesData } = useCategories(true);

  const onPresence = useCallback((users: TShoppingPresenceUser[]) => {
    setShoppingUsers(users);
  }, []);
  const onActivity = useCallback((activity: TShoppingActivity) => {
    setShoppingActivities((currentActivities) =>
      [
        activity,
        ...currentActivities.filter(
          (currentActivity) =>
            currentActivity.createdAt !== activity.createdAt ||
            currentActivity.actor.id !== activity.actor.id ||
            currentActivity.product.id !== activity.product.id
        )
      ].slice(0, 4)
    );
  }, []);

  useShoppingUpdates(true, { onActivity, onPresence });
  useWakeLock(auth.settings?.wakeLockEnabled ?? true);

  const items = useMemo(() => shoppingList?.items ?? [], [shoppingList]);
  const products = useMemo(() => productsData ?? [], [productsData]);
  const recentProducts = useMemo(
    () => recentProductsData ?? [],
    [recentProductsData]
  );
  const suggestedProducts = useMemo(
    () => suggestedProductsData ?? [],
    [suggestedProductsData]
  );
  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending'),
    [items]
  );
  const ignoredItems = useMemo(
    () => items.filter((item) => item.status === 'ignored'),
    [items]
  );
  const activeItems = reviewSkipped ? ignoredItems : pendingItems;
  const categoryOrder = useMemo(() => {
    const orderedNames = (categoriesData ?? []).map(
      (category) => category.name
    );

    return [...orderedNames, t('common.uncategorized')];
  }, [categoriesData, t]);
  const checkedCount = useMemo(
    () => items.filter((item) => item.status === 'checked').length,
    [items]
  );
  const discardedCount = useMemo(
    () => items.filter((item) => item.status === 'discarded').length,
    [items]
  );
  const skippedCount = ignoredItems.length + discardedCount;
  const isComplete =
    items.length > 0 && pendingItems.length === 0 && ignoredItems.length === 0;
  const shoppingDurationMinutes = useMemo(() => {
    const timestamps = items
      .map((item) => item.statusUpdatedAt)
      .filter((value): value is number => value != null);

    if (timestamps.length === 0) {
      return null;
    }

    return Math.max(0, Math.round((Date.now() - Math.min(...timestamps)) / 60000));
  }, [items]);
  const checkedProgress =
    items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;
  const shouldReviewSkipped =
    !reviewSkipped && pendingItems.length === 0 && ignoredItems.length > 0;
  const compactShoppingList = auth.settings?.compactShoppingList ?? true;
  const hapticsEnabled = auth.settings?.hapticsEnabled ?? true;
  const soundEnabled = auth.settings?.soundEnabled ?? false;

  const setStatus = useCallback(
    async (
      item: TOngoingListEntry,
      status: TOngoingListItemStatus,
      options?: { silent?: boolean }
    ) => {
      let vibrated = true;

      if (hapticsEnabled && status === 'checked') {
        vibrated = vibrate(60);
      } else if (
        hapticsEnabled &&
        (status === 'ignored' || status === 'discarded')
      ) {
        vibrated = vibrate([35, 35, 70]);
      }

      if (hapticsEnabled && !vibrated && !hapticsUnsupportedToastShown.current) {
        hapticsUnsupportedToastShown.current = true;
        toast.info(t('shopping.hapticsBlocked'));
      }

      try {
        await setItemStatus({ id: item.id, status });

        if (
          soundEnabled &&
          (status === 'checked' ||
            status === 'ignored' ||
            status === 'discarded')
        ) {
          playActionTone(status);
        }

        if (!options?.silent && status !== 'pending') {
          const messageKey =
            status === 'checked'
              ? 'shopping.checkedToast'
              : status === 'discarded'
                ? 'shopping.discardedToast'
                : 'shopping.skippedToast';

          toast(t(messageKey, { title: item.title }), {
            action: {
              label: t('common.undo'),
              onClick: () => {
                void setItemStatus({ id: item.id, status: 'pending' });
              }
            }
          });
        }
      } catch (mutationError) {
        toast.error(
          parseTrpcErrors(mutationError)._general ?? t('shopping.failedToUpdateProduct')
        );
      }
    },
    [hapticsEnabled, setItemStatus, soundEnabled, t]
  );
  const check = useCallback(
    (item: TOngoingListEntry) => {
      setStatus(item, 'checked');
    },
    [setStatus]
  );
  const onSwipeAction = useCallback(
    (item: TOngoingListEntry, action: 'checked' | 'ignored' | 'discarded') => {
      setStatus(item, action);
    },
    [setStatus]
  );
  const discard = useCallback(
    (item: TOngoingListEntry) => {
      setStatus(item, 'discarded');
    },
    [setStatus]
  );
  const discardSkipped = useCallback(async () => {
    const confirmed = await requestConfirmation({
      title: t('shopping.discardSkippedTitle'),
      message: t('shopping.discardSkippedMessage', {
        count: ignoredItems.length
      }),
      confirmLabel: t('shopping.discardSkipped'),
      cancelLabel: t('shopping.keepReviewing'),
      variant: 'danger'
    });

    if (!confirmed) {
      return;
    }

    await Promise.all(
      ignoredItems.map((item) => setStatus(item, 'discarded', { silent: true }))
    );
  }, [ignoredItems, setStatus, t]);
  const startSkippedReview = useCallback(() => {
    setReviewSkipped(true);
    setView('swipe');
  }, []);
  const showListView = useCallback(() => {
    setView('list');
  }, []);
  const showSwipeView = useCallback(() => {
    setView('swipe');
  }, []);
  const toggleCompactShoppingList = useCallback(async () => {
    try {
      await updateSettings({ compactShoppingList: !compactShoppingList });
    } catch (settingsError) {
      toast.error(
        parseTrpcErrors(settingsError)._general ??
          t('shopping.failedToUpdateLayout')
      );
    }
  }, [compactShoppingList, t, updateSettings]);
  const showMainList = useCallback(() => {
    setReviewSkipped(false);
  }, []);
  const openAddDialog = useCallback(() => {
    setAddDialogOpen(true);
  }, []);
  const addSelectedProducts = useCallback(
    async (productIds: string[]) => {
      try {
        await addProducts({ productIds });
        await queryClient.invalidateQueries({
          queryKey: shoppingListQueryKey
        });
        setAddDialogOpen(false);
        toast.success(t('shopping.itemsAdded'));
      } catch (addError) {
        toast.error(
          parseTrpcErrors(addError)._general ?? t('home.failedToAddProducts')
        );
      }
    },
    [addProducts, t]
  );
  const finish = useCallback(async () => {
    try {
      await finishShopping();
      await clearShoppingListState();
      toast.success(t('shopping.shoppingFinished'));
      navigate('/', { replace: true });
    } catch (finishError) {
      toast.error(
        parseTrpcErrors(finishError)._general ?? t('shopping.failedToFinish')
      );
    }
  }, [finishShopping, navigate, t]);
  const cancel = useCallback(async () => {
    const confirmed = await requestConfirmation({
      title: t('shopping.cancelTitle'),
      message:
        t('shopping.cancelMessage'),
      confirmLabel: t('shopping.cancelConfirm'),
      cancelLabel: t('shopping.keepShopping'),
      variant: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      await cancelShopping();
      await clearShoppingListState();
      toast.success(t('shopping.shoppingCancelled'));
      navigate('/', { replace: true });
    } catch (cancelError) {
      toast.error(
        parseTrpcErrors(cancelError)._general ?? t('shopping.failedToCancel')
      );
    }
  }, [cancelShopping, navigate, t]);

  useEffect(() => {
    if (!isLoading && !shoppingList) {
      navigate('/', { replace: true });
    }
  }, [isLoading, navigate, shoppingList]);

  if (isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
        <Spinner size="sm" aria-label={t('shopping.loading')} />
      </main>
    );
  }

  if (error || !shoppingList) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
        <Stack gap="md" align="center">
          <ShoppingCart className="size-10 text-muted-foreground" />
          <Text weight="semibold">{t('shopping.noActiveList')}</Text>
          <Button type="button" onClick={() => navigate('/')}>
            {t('shopping.backHome')}
          </Button>
        </Stack>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div
        className={cn(
          'mx-auto flex min-h-dvh w-full flex-col',
          view === 'swipe'
            ? 'max-w-none gap-0 p-0'
            : 'max-w-3xl gap-4 px-4 py-4 sm:px-6'
        )}
      >
        {view === 'list' && (
          <Surface
            radius="xl"
            padding="md"
            className="bg-card/95 backdrop-blur"
          >
            <Stack gap="md">
              <ShoppingProgress
                checkedCount={checkedCount}
                totalCount={items.length}
              />
              <Inline justify="between" wrap={false} className="gap-3">
                <Inline gap="xs" wrap={false}>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="rounded-full"
                    onClick={showListView}
                  >
                    <List className="size-4" />
                    {t('shopping.list')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={showSwipeView}
                  >
                    <Hand className="size-4" />
                    {t('shopping.swipe')}
                  </Button>
                  <Button
                    type="button"
                    variant={compactShoppingList ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-full"
                    disabled={updateSettingsPending}
                    onClick={toggleCompactShoppingList}
                  >
                    {compactShoppingList
                      ? t('shopping.compact')
                      : t('shopping.comfort')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={openAddDialog}
                  >
                    <Plus className="size-4" />
                    {t('shopping.addItem')}
                  </Button>
                </Inline>
                {reviewSkipped && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={showMainList}
                  >
                    <RotateCcw className="size-4" />
                    {t('shopping.mainList')}
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  disabled={cancelShoppingPending}
                  onClick={cancel}
                >
                  {t('shopping.cancel')}
                </Button>
              </Inline>
            </Stack>
          </Surface>
        )}

        {view === 'list' && (
          <ShoppingLiveStatus
            users={shoppingUsers}
            activities={shoppingActivities}
            currentUserId={auth.userId}
          />
        )}

        {shouldReviewSkipped && (
          <Surface radius="xl" padding="lg" className="text-center">
            <Stack gap="md" align="center">
              <RotateCcw className="size-10 text-orange-500" />
              <Text weight="semibold">{t('shopping.reviewSkippedTitle')}</Text>
              <Text size="sm" tone="muted">
                {t('shopping.reviewSkippedDescription', {
                  count: ignoredItems.length
                })}
              </Text>
              <Inline justify="center">
                <Button
                  type="button"
                  onClick={startSkippedReview}
                >
                  {t('shopping.reviewSkipped')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={discardSkipped}
                >
                  {t('shopping.discardSkipped')}
                </Button>
              </Inline>
            </Stack>
          </Surface>
        )}

        {isComplete && (
          <div
            className={cn(
              'grid place-items-center',
              view === 'swipe' ? 'min-h-dvh p-4' : 'min-h-[calc(100dvh-12rem)]'
            )}
          >
            <motion.div
              className="w-full max-w-md"
              initial={
                reduceMotion ? false : { opacity: 0, scale: 0.96, y: 8 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Surface radius="xl" padding="lg" className="w-full text-center">
                <Stack gap="lg" align="center">
                  <div className="grid size-16 place-items-center rounded-full bg-green-500/15 text-green-600">
                    <CheckCircle2 className="size-9" />
                  </div>
                  <Stack gap="xs" align="center">
                    <Text weight="semibold" className="text-2xl">
                      {t('shopping.shoppingDone')}
                    </Text>
                    <Text size="sm" tone="muted">
                      {t('shopping.celebrationSubtitle', {
                        count: checkedCount
                      })}
                    </Text>
                  </Stack>

                  <ProgressSummary
                    tone="success"
                    size="lg"
                    className="w-full"
                    label={t('shopping.statChecked')}
                    value={`${checkedCount}/${items.length}`}
                    progress={checkedProgress}
                  />

                  <div className="grid w-full grid-cols-2 gap-3">
                    <Stat
                      tone="success"
                      label={t('shopping.statChecked')}
                      value={checkedCount}
                    />
                    <Stat
                      tone="warn"
                      label={t('shopping.statSkipped')}
                      value={skippedCount}
                    />
                    <Stat
                      tone="muted"
                      label={t('shopping.statProducts')}
                      value={items.length}
                    />
                    {shoppingDurationMinutes != null && (
                      <Stat
                        tone="muted"
                        label={t('shopping.statDuration')}
                        value={
                          shoppingDurationMinutes < 1
                            ? t('shopping.durationQuick')
                            : t('shopping.durationMinutes', {
                                count: shoppingDurationMinutes
                              })
                        }
                      />
                    )}
                  </div>

                  <Button
                    type="button"
                    className="w-full"
                    disabled={finishShoppingPending}
                    onClick={finish}
                  >
                    {t('shopping.finishShopping')}
                  </Button>
                </Stack>
              </Surface>
            </motion.div>
          </div>
        )}

        {!shouldReviewSkipped && !isComplete && view === 'list' && (
          <ShoppingListView
            items={activeItems}
            isPending={setItemStatusPending}
            compact={compactShoppingList}
            reviewSkipped={reviewSkipped}
            categoryOrder={categoryOrder}
            onCheck={check}
            onDiscard={discard}
          />
        )}

        {!shouldReviewSkipped && !isComplete && view === 'swipe' && (
          <ShoppingSwipeView
            items={activeItems}
            reviewSkipped={reviewSkipped}
            isPending={setItemStatusPending}
            checkedCount={checkedCount}
            skippedCount={skippedCount}
            totalCount={items.length}
            categoryOrder={categoryOrder}
            liveUsers={shoppingUsers}
            liveActivities={shoppingActivities}
            currentUserId={auth.userId}
            onListView={showListView}
            onMainList={showMainList}
            onCancelShopping={cancel}
            onAddItem={openAddDialog}
            onAction={onSwipeAction}
          />
        )}
      </div>

      <AddProductsDialog
        open={addDialogOpen}
        products={products}
        recentProducts={recentProducts}
        suggestedProducts={suggestedProducts}
        ongoingItems={items}
        isPending={addProductsPending}
        onOpenChange={setAddDialogOpen}
        onSubmit={addSelectedProducts}
      />
    </main>
  );
});

Shopping.displayName = 'Shopping';

export { Shopping };
