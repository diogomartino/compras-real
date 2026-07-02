import { Inline, Media, Stack, StatusChip, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import type { TOngoingListEntry } from '@myapp/shared';
import { Check, X } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatQuantity, getGroupedItems } from './helpers';

type TShoppingListViewProps = {
  items: TOngoingListEntry[];
  isPending: boolean;
  compact: boolean;
  reviewSkipped: boolean;
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
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3">
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
            className={compact ? 'size-11 rounded-2xl' : 'size-12 rounded-2xl'}
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
                compact ? 'size-11 rounded-2xl' : 'size-12 rounded-2xl'
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
    onCheck,
    onDiscard
  }: TShoppingListViewProps) => {
    const { t } = useTranslation();
    const groups = useMemo(
      () => getGroupedItems(items, t('common.uncategorized')),
      [items, t]
    );

    return (
      <Stack gap="lg">
        {groups.map((group) => (
          <Stack key={group.categoryName} gap="sm">
            <Inline
              justify="between"
              className="sticky top-2 z-10 rounded-full bg-background/95 px-3 py-1.5 shadow-sm"
              wrap={false}
            >
              <Text weight="semibold">{group.categoryName}</Text>
              <StatusChip tone="muted">{group.items.length}</StatusChip>
            </Inline>
            {group.items.map((item) => (
              <ShoppingListRow
                key={item.id}
                item={item}
                isPending={isPending}
                compact={compact}
                reviewSkipped={reviewSkipped}
                onCheck={onCheck}
                onDiscard={onDiscard}
              />
            ))}
          </Stack>
        ))}
      </Stack>
    );
  }
);

ShoppingListView.displayName = 'ShoppingListView';

export { ShoppingListView };
