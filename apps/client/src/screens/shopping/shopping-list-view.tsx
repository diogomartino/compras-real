import { Inline, Media, Stack, StatusChip, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import type { TOngoingListEntry } from '@myapp/shared';
import { Check, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatQuantity, getGroupedItems } from './helpers';

type TShoppingListViewProps = {
  items: TOngoingListEntry[];
  isPending: boolean;
  compact: boolean;
  reviewSkipped: boolean;
  categoryOrder?: string[];
  onCheck: (item: TOngoingListEntry) => void;
  onDiscard: (item: TOngoingListEntry) => void;
};

type TShoppingListRowProps = {
  item: TOngoingListEntry;
  isPending: boolean;
  compact: boolean;
  reviewSkipped: boolean;
  onCheck: (item: TOngoingListEntry) => void;
  onDiscard: (item: TOngoingListEntry) => void;
};

const ShoppingListRow = memo(
  ({
    item,
    isPending,
    compact,
    reviewSkipped,
    onCheck,
    onDiscard
  }: TShoppingListRowProps) => {
    const { t } = useTranslation();
    const check = useCallback(() => {
      onCheck(item);
    }, [item, onCheck]);
    const discard = useCallback(() => {
      onDiscard(item);
    }, [item, onDiscard]);

    return (
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/70 bg-card/75 p-3 transition-colors active:bg-accent/35">
        {!compact && <Media src={item.imageUrl} alt={item.title} size="md" />}
        {compact && (
          <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Check className="size-4" />
          </div>
        )}
        <Stack gap="xs" className="min-w-0">
          <Text
            weight="semibold"
            className={compact ? 'truncate text-base' : 'truncate'}
          >
            {item.title}
          </Text>
          <StatusChip tone="info">
            {formatQuantity(item.quantityAmount, item.quantityUnit)}
          </StatusChip>
        </Stack>
        <Inline gap="xs" wrap={false}>
          <Button
            type="button"
            size="icon"
            className={compact ? 'size-11 rounded-xl' : 'size-12 rounded-xl'}
            disabled={isPending}
            onClick={check}
            aria-label={t('shopping.markChecked', { title: item.title })}
          >
            <Check className={compact ? 'size-5' : 'size-6'} />
          </Button>
          {reviewSkipped && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              className={
                compact ? 'size-11 rounded-xl' : 'size-12 rounded-xl'
              }
              disabled={isPending}
              onClick={discard}
              aria-label={t('shopping.discardProduct')}
            >
              <X className={compact ? 'size-5' : 'size-6'} />
            </Button>
          )}
        </Inline>
      </div>
    );
  }
);

ShoppingListRow.displayName = 'ShoppingListRow';

const ShoppingListView = memo(
  ({
    items,
    isPending,
    compact,
    reviewSkipped,
    categoryOrder,
    onCheck,
    onDiscard
  }: TShoppingListViewProps) => {
    const { t } = useTranslation();
    const reduceMotion = useReducedMotion();
    const groups = useMemo(
      () => getGroupedItems(items, t('common.uncategorized'), categoryOrder),
      [categoryOrder, items, t]
    );

    return (
      <Stack gap="lg">
        {groups.map((group) => (
          <Stack key={group.categoryName} gap="sm">
            <Inline
              justify="between"
              className="sticky top-2 z-10 rounded-full border border-border/70 bg-background/95 px-3 py-1.5 backdrop-blur"
              wrap={false}
            >
              <Text weight="semibold">{group.categoryName}</Text>
              <StatusChip tone="muted">{group.items.length}</StatusChip>
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
                  <ShoppingListRow
                    item={item}
                    isPending={isPending}
                    compact={compact}
                    reviewSkipped={reviewSkipped}
                    onCheck={onCheck}
                    onDiscard={onDiscard}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        ))}
      </Stack>
    );
  }
);

ShoppingListView.displayName = 'ShoppingListView';

export { ShoppingListView };
