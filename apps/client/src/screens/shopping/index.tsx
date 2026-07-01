import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { requestConfirmation } from '@/features/dialogs/actions';
import { useAuth } from '@/features/auth/hooks';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useWakeLock } from '@/hooks/use-wake-lock';
import {
  clearShoppingListState,
  useCancelShopping,
  useFinishShopping,
  useSetShoppingItemStatus
} from '@/mutations/shopping';
import { useShoppingList, useShoppingUpdates } from '@/queries/shopping';
import type { TOngoingListEntry, TOngoingListItemStatus } from '@myapp/shared';
import { CheckCircle2, List, RotateCcw, ShoppingCart, Sparkles } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { vibrate } from './helpers';
import { ShoppingListView } from './shopping-list-view';
import { ShoppingProgress } from './shopping-progress';
import { ShoppingSwipeView } from './shopping-swipe-view';

type TShoppingView = 'list' | 'swipe';

const Shopping = memo(() => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [view, setView] = useState<TShoppingView>(
    auth.settings?.defaultShoppingMode ?? 'list'
  );
  const [reviewSkipped, setReviewSkipped] = useState(false);
  const { data: shoppingList, isLoading, error } = useShoppingList(true);
  const { mutateAsync: setItemStatus, isPending: setItemStatusPending } =
    useSetShoppingItemStatus();
  const { mutateAsync: finishShopping, isPending: finishShoppingPending } =
    useFinishShopping();
  const { mutateAsync: cancelShopping, isPending: cancelShoppingPending } =
    useCancelShopping();

  useShoppingUpdates(true);
  useWakeLock(true);

  const items = useMemo(() => shoppingList?.items ?? [], [shoppingList]);
  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending'),
    [items]
  );
  const ignoredItems = useMemo(
    () => items.filter((item) => item.status === 'ignored'),
    [items]
  );
  const activeItems = reviewSkipped ? ignoredItems : pendingItems;
  const categoryOrder = useMemo(
    () =>
      Array.from(
        new Set(items.map((item) => item.categoryName ?? 'Uncategorized'))
      ),
    [items]
  );
  const checkedCount = useMemo(
    () => items.filter((item) => item.status === 'checked').length,
    [items]
  );
  const discardedCount = useMemo(
    () => items.filter((item) => item.status === 'discarded').length,
    [items]
  );
  const skippedCount = ignoredItems.length + discardedCount;
  const isComplete = items.length > 0 && pendingItems.length === 0 && ignoredItems.length === 0;
  const shouldReviewSkipped = !reviewSkipped && pendingItems.length === 0 && ignoredItems.length > 0;

  const setStatus = useCallback(
    async (item: TOngoingListEntry, status: TOngoingListItemStatus) => {
      try {
        await setItemStatus({ id: item.id, status });

        if (status === 'checked') {
          vibrate(12);
        } else if (status === 'ignored' || status === 'discarded') {
          vibrate([8, 20, 8]);
        }
      } catch (mutationError) {
        toast.error(
          parseTrpcErrors(mutationError)._general ?? 'Failed to update product.'
        );
      }
    },
    [setItemStatus]
  );
  const check = useCallback(
    (item: TOngoingListEntry) => {
      void setStatus(item, 'checked');
    },
    [setStatus]
  );
  const onSwipeAction = useCallback(
    (item: TOngoingListEntry, action: 'checked' | 'ignored' | 'discarded') => {
      void setStatus(item, action);
    },
    [setStatus]
  );
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
  const showMainList = useCallback(() => {
    setReviewSkipped(false);
  }, []);
  const finish = useCallback(async () => {
    try {
      await finishShopping();
      await clearShoppingListState();
      toast.success('Shopping finished.');
      navigate('/', { replace: true });
    } catch (finishError) {
      toast.error(
        parseTrpcErrors(finishError)._general ?? 'Failed to finish shopping.'
      );
    }
  }, [finishShopping, navigate]);
  const cancel = useCallback(async () => {
    const confirmed = await requestConfirmation({
      title: 'Cancel shopping mode?',
      message:
        'The current list will stay available and product states will be reset.',
      confirmLabel: 'Cancel shopping',
      cancelLabel: 'Keep shopping',
      variant: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      await cancelShopping();
      await clearShoppingListState();
      toast.success('Shopping cancelled.');
      navigate('/', { replace: true });
    } catch (cancelError) {
      toast.error(
        parseTrpcErrors(cancelError)._general ?? 'Failed to cancel shopping.'
      );
    }
  }, [cancelShopping, navigate]);

  useEffect(() => {
    if (!isLoading && !shoppingList) {
      navigate('/', { replace: true });
    }
  }, [isLoading, navigate, shoppingList]);

  if (isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
        <Text tone="muted">Loading shopping mode...</Text>
      </main>
    );
  }

  if (error || !shoppingList) {
    return (
      <main className="grid min-h-dvh place-items-center bg-background p-6 text-center text-foreground">
        <Stack gap="md" align="center">
          <ShoppingCart className="size-10 text-muted-foreground" />
          <Text weight="semibold">No shopping list is active</Text>
          <Button type="button" onClick={() => navigate('/')}>
            Back home
          </Button>
        </Stack>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {view === 'list' && (
          <Surface radius="2xl" padding="md" className="bg-card/95 backdrop-blur">
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
                    List
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={showSwipeView}
                  >
                    <Sparkles className="size-4" />
                    Swipe
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
                    Main list
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
                  Cancel
                </Button>
              </Inline>
            </Stack>
          </Surface>
        )}

        {shouldReviewSkipped && (
          <Surface radius="2xl" padding="lg" className="text-center">
            <Stack gap="md" align="center">
              <RotateCcw className="size-10 text-orange-500" />
              <Text weight="semibold">Review skipped products</Text>
              <Text size="sm" tone="muted">
                {ignoredItems.length} products were ignored. Review them before finishing.
              </Text>
              <Button type="button" className="rounded-xl" onClick={startSkippedReview}>
                Review skipped
              </Button>
            </Stack>
          </Surface>
        )}

        {isComplete && (
          <Surface radius="2xl" padding="lg" className="text-center">
            <Stack gap="md" align="center">
              <CheckCircle2 className="size-12 text-green-600" />
              <Stack gap="xs" align="center">
                <Text weight="semibold" className="text-xl">
                  Shopping done
                </Text>
                <Text size="sm" tone="muted">
                  {checkedCount} checked, {discardedCount} discarded
                </Text>
              </Stack>
              <Button
                type="button"
                className="rounded-xl"
                disabled={finishShoppingPending}
                onClick={finish}
              >
                Finish shopping
              </Button>
            </Stack>
          </Surface>
        )}

        {!shouldReviewSkipped && !isComplete && view === 'list' && (
          <ShoppingListView
            items={activeItems}
            isPending={setItemStatusPending}
            onCheck={check}
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
            onListView={showListView}
            onMainList={showMainList}
            onCancelShopping={cancel}
            onAction={onSwipeAction}
          />
        )}
      </div>
    </main>
  );
});

Shopping.displayName = 'Shopping';

export { Shopping };
