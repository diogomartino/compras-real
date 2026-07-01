import { Inline, Media, Stack, StatusChip, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import type { TOngoingListEntry } from '@myapp/shared';
import { Check } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { formatQuantity, getGroupedItems } from './helpers';

type TShoppingListViewProps = {
  items: TOngoingListEntry[];
  isPending: boolean;
  onCheck: (item: TOngoingListEntry) => void;
};

type TShoppingListRowProps = {
  item: TOngoingListEntry;
  isPending: boolean;
  onCheck: (item: TOngoingListEntry) => void;
};

const ShoppingListRow = memo(
  ({ item, isPending, onCheck }: TShoppingListRowProps) => {
    const check = useCallback(() => {
      onCheck(item);
    }, [item, onCheck]);

    return (
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3">
        <Media src={item.imageUrl} alt={item.title} size="md" />
        <Stack gap="xs" className="min-w-0">
          <Text weight="semibold" className="truncate">
            {item.title}
          </Text>
          <StatusChip tone="info">
            {formatQuantity(item.quantityAmount, item.quantityUnit)}
          </StatusChip>
        </Stack>
        <Button
          type="button"
          size="icon"
          className="size-12 rounded-2xl"
          disabled={isPending}
          onClick={check}
          aria-label={`Mark ${item.title} as checked`}
        >
          <Check className="size-6" />
        </Button>
      </div>
    );
  }
);

ShoppingListRow.displayName = 'ShoppingListRow';

const ShoppingListView = memo(
  ({ items, isPending, onCheck }: TShoppingListViewProps) => {
    const groups = useMemo(() => getGroupedItems(items), [items]);

    return (
      <Stack gap="lg">
        {groups.map((group) => (
          <Stack key={group.categoryName} gap="sm">
            <Inline justify="between" className="px-1" wrap={false}>
              <Text weight="semibold">{group.categoryName}</Text>
              <StatusChip tone="muted">{group.items.length}</StatusChip>
            </Inline>
            {group.items.map((item) => (
              <ShoppingListRow
                key={item.id}
                item={item}
                isPending={isPending}
                onCheck={onCheck}
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
