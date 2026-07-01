import { Inline, Media, Stack, StatusChip, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { TOngoingListEntry } from '@myapp/shared';
import { Check, List, MoreHorizontal, RotateCcw, X } from 'lucide-react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo
} from 'motion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { formatQuantity } from './helpers';

type TSwipeAction = 'checked' | 'ignored' | 'discarded';

type TShoppingSwipeViewProps = {
  items: TOngoingListEntry[];
  reviewSkipped: boolean;
  isPending: boolean;
  checkedCount: number;
  skippedCount: number;
  totalCount: number;
  categoryOrder: string[];
  onListView: () => void;
  onMainList: () => void;
  onCancelShopping: () => void;
  onAction: (item: TOngoingListEntry, action: TSwipeAction) => void;
};

const ShoppingSwipeView = memo(
  ({
    items,
    reviewSkipped,
    isPending,
    checkedCount,
    skippedCount,
    totalCount,
    categoryOrder,
    onListView,
    onMainList,
    onCancelShopping,
    onAction
  }: TShoppingSwipeViewProps) => {
    const [categoryName, setCategoryName] = useState<string>();
    const [dismissedItemIds, setDismissedItemIds] = useState<string[]>([]);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-260, 0, 260], [-12, 0, 12]);
    const checkOpacity = useTransform(x, [70, 180], [0, 1]);
    const skipOpacity = useTransform(x, [-180, -70], [1, 0]);
    const swipeItems = useMemo(
      () => items.filter((item) => !dismissedItemIds.includes(item.id)),
      [dismissedItemIds, items]
    );
    const categoryCounts = useMemo(() => {
      return new Map(
        categoryOrder.map((currentCategoryName) => [
          currentCategoryName,
          swipeItems.filter(
            (item) =>
              (item.categoryName ?? 'Uncategorized') === currentCategoryName
          ).length
        ])
      );
    }, [categoryOrder, swipeItems]);
    const availableCategories = useMemo(
      () =>
        categoryOrder.filter(
          (currentCategoryName) =>
            (categoryCounts.get(currentCategoryName) ?? 0) > 0
        ),
      [categoryCounts, categoryOrder]
    );
    const effectiveCategoryName = useMemo(() => {
      if (!categoryName) {
        return availableCategories[0];
      }

      if ((categoryCounts.get(categoryName) ?? 0) > 0) {
        return categoryName;
      }

      const selectedCategoryIndex = categoryOrder.indexOf(categoryName);
      const nextCategory = categoryOrder
        .slice(selectedCategoryIndex + 1)
        .find(
          (currentCategoryName) =>
            (categoryCounts.get(currentCategoryName) ?? 0) > 0
        );

      return nextCategory ?? availableCategories[0];
    }, [availableCategories, categoryCounts, categoryName, categoryOrder]);
    const visibleItems = useMemo(() => {
      if (!effectiveCategoryName) {
        return [];
      }

      return swipeItems.filter(
        (item) => (item.categoryName ?? 'Uncategorized') === effectiveCategoryName
      );
    }, [effectiveCategoryName, swipeItems]);
    const currentItem = visibleItems[0];
    const currentItemId = currentItem?.id;
    const activeCategoryName =
      currentItem?.categoryName ?? effectiveCategoryName ?? 'Uncategorized';
    const checkedProgress = useMemo(() => {
      if (totalCount === 0) {
        return 0;
      }

      return Math.round((checkedCount / totalCount) * 100);
    }, [checkedCount, totalCount]);
    const skippedProgress = useMemo(() => {
      if (totalCount === 0) {
        return 0;
      }

      return Math.round((skippedCount / totalCount) * 100);
    }, [skippedCount, totalCount]);
    const selectCategory = useCallback((nextCategoryName: string) => {
      setCategoryName(nextCategoryName);
    }, []);
    const completeSwipe = useCallback(
      (action: TSwipeAction, direction: 'left' | 'right') => {
        if (!currentItem) {
          return;
        }

        const swipedItem = currentItem;

        onAction(swipedItem, action);
        void animate(x, direction === 'right' ? window.innerWidth : -window.innerWidth, {
          duration: 0.12,
          ease: 'easeOut'
        }).then(() => {
          setDismissedItemIds((currentIds) => [...currentIds, swipedItem.id]);
          x.set(0);
        });
      },
      [currentItem, onAction, x]
    );
    const check = useCallback(() => {
      completeSwipe('checked', 'left');
    }, [completeSwipe]);
    const skip = useCallback(() => {
      completeSwipe(reviewSkipped ? 'discarded' : 'ignored', 'right');
    }, [completeSwipe, reviewSkipped]);
    const onDragEnd = useCallback(
      (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offsetX = info.offset.x;
        const velocityX = info.velocity.x;

        if (offsetX > 180 || velocityX > 900) {
          skip();
          return;
        }

        if (offsetX < -180 || velocityX < -900) {
          check();
          return;
        }

        void animate(x, 0, {
          type: 'spring',
          stiffness: 420,
          damping: 32
        });
      },
      [check, skip, x]
    );

    useEffect(() => {
      x.set(0);
    }, [currentItemId, x]);

    useEffect(() => {
      setDismissedItemIds((currentIds) =>
        currentIds.filter((itemId) => items.some((item) => item.id === itemId))
      );
    }, [items]);

    if (!currentItem) {
      return (
        <Stack gap="md" align="center" className="py-12 text-center">
          <RotateCcw className="size-10 text-muted-foreground" />
          <Text weight="semibold">No products in this category</Text>
          <Text size="sm" tone="muted">
            Pick another category or switch back to list view.
          </Text>
        </Stack>
      );
    }

    return (
      <div className="grid min-h-[calc(100dvh-10rem)] flex-1">
        <motion.div
          className="relative isolate grid min-h-[calc(100dvh-10rem)] touch-none select-none overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/20"
          style={{ x, rotate }}
          drag={isPending ? false : 'x'}
          dragElastic={0.18}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          <Media
            src={currentItem.imageUrl}
            alt={currentItem.title}
            size={undefined}
            className="absolute inset-0 -z-10 size-full rounded-none border-0"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/55 via-black/5 to-black/80" />
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 grid place-items-center bg-linear-to-l from-transparent via-zinc-700/65 to-zinc-500/85 text-white"
            style={{ opacity: checkOpacity }}
          >
            <div className="grid place-items-center gap-3 rounded-[2rem] bg-black/25 px-8 py-6 text-center shadow-2xl">
              <X className="size-14" />
              <span className="text-4xl font-black uppercase tracking-widest">
                {reviewSkipped ? 'Discard' : 'Skip'}
              </span>
            </div>
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 grid place-items-center bg-linear-to-r from-transparent via-green-500/60 to-green-400/80 text-white"
            style={{ opacity: skipOpacity }}
          >
            <div className="grid place-items-center gap-3 rounded-[2rem] bg-black/25 px-8 py-6 text-center shadow-2xl">
              <Check className="size-14" />
              <span className="text-4xl font-black uppercase tracking-widest">
                Got it
              </span>
            </div>
          </motion.div>

          <div
            className="absolute inset-x-0 top-0 z-10 flex items-start gap-3 p-4 text-white"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerMove={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <div className="flex gap-2 overflow-x-auto pb-1">
              {availableCategories.map((currentCategoryName) => (
                <Button
                  key={currentCategoryName}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'shrink-0 rounded-full border border-white/30 bg-white/15 text-white shadow-sm hover:bg-white/25 hover:text-white',
                    currentCategoryName === activeCategoryName &&
                      'border-white bg-white text-foreground hover:bg-white hover:text-foreground'
                  )}
                  onClick={() => selectCategory(currentCategoryName)}
                >
                  {currentCategoryName}
                  <span className="text-xs opacity-70">
                    {categoryCounts.get(currentCategoryName) ?? 0}
                  </span>
                </Button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full border border-white/30 bg-white/15 text-white shadow-sm hover:bg-white/25 hover:text-white"
                  aria-label="Shopping view options"
                >
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem onSelect={onListView}>
                  <List className="size-4" />
                  List view
                </DropdownMenuItem>
                {reviewSkipped && (
                  <DropdownMenuItem onSelect={onMainList}>
                    <RotateCcw className="size-4" />
                    Main list
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem variant="destructive" onSelect={onCancelShopping}>
                  <X className="size-4" />
                  Cancel shopping
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div
            className="absolute inset-x-0 bottom-0 z-10 p-5 text-white"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerMove={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <Stack gap="md">
              <Stack gap="sm">
                <div>
                  <span className="inline-block max-w-full rounded-full border border-white/20 bg-black/55 px-3 py-1.5 text-base font-semibold leading-tight text-white shadow-lg">
                    {currentItem.title}
                  </span>
                </div>
                <Inline gap="sm">
                  <StatusChip className="border-white/25 bg-white/20 text-white">
                    {currentItem.categoryName ?? 'Uncategorized'}
                  </StatusChip>
                  <StatusChip className="border-white/25 bg-white/20 text-white">
                    {formatQuantity(
                      currentItem.quantityAmount,
                      currentItem.quantityUnit
                    )}
                  </StatusChip>
                </Inline>
              </Stack>
              <div className="relative overflow-hidden rounded-full bg-white/25">
                <div className="flex h-5">
                  <div
                    className="h-full bg-green-400 transition-all duration-300"
                    style={{ width: `${checkedProgress}%` }}
                  />
                  <div
                    className="h-full bg-red-400 transition-all duration-300"
                    style={{ width: `${skippedProgress}%` }}
                  />
                </div>
                <div className="absolute inset-0 grid place-items-center text-xs font-bold text-white drop-shadow">
                  {checkedCount + skippedCount}/{totalCount}
                </div>
              </div>

              <Inline justify="center" gap="lg" wrap={false}>
                <Button
                  type="button"
                  className="size-16 rounded-full bg-green-500 text-white shadow-lg shadow-green-950/30 hover:bg-green-500/90"
                  disabled={isPending}
                  onClick={check}
                  aria-label="Mark product as checked"
                >
                  <Check className="size-7" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="size-16 rounded-full border-white/30 bg-white/15 text-white shadow-lg hover:bg-white/25 hover:text-white"
                  disabled={isPending}
                  onClick={skip}
                  aria-label={reviewSkipped ? 'Discard product' : 'Ignore product'}
                >
                  <X className="size-7" />
                </Button>
              </Inline>
            </Stack>
          </div>
        </motion.div>
      </div>
    );
  }
);

ShoppingSwipeView.displayName = 'ShoppingSwipeView';

export { ShoppingSwipeView };
