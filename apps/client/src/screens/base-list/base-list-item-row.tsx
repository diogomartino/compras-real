import { Inline, Media, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { formatQuantity } from './helpers';
import type { TBaseListEntry } from './types';

type TBaseListItemRowProps = {
  item: TBaseListEntry;
  isMutating: boolean;
  onEdit: (item: TBaseListEntry) => void;
  onRemove: (item: TBaseListEntry) => void;
};

const BaseListItemRow = memo(
  ({ item, isMutating, onEdit, onRemove }: TBaseListItemRowProps) => {
    const quantity = useMemo(
      () => formatQuantity(item.quantityAmount, item.quantityUnit),
      [item.quantityAmount, item.quantityUnit]
    );
    const edit = useCallback(() => {
      onEdit(item);
    }, [item, onEdit]);
    const remove = useCallback(() => {
      onRemove(item);
    }, [item, onRemove]);

    return (
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-4">
        <Media src={item.imageUrl} alt={item.title} size="lg" />

        <div className="min-w-0 space-y-1">
          <Text as="div" weight="semibold" className="truncate leading-tight">
            {item.title}
          </Text>
          <Text size="sm" tone="muted" className="truncate">
            {item.categoryName ?? 'Uncategorized'} · {quantity}
          </Text>
        </div>

        <Inline
          gap="xs"
          wrap={false}
          className="col-span-2 justify-end sm:col-span-1"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-w-24 rounded-xl"
            disabled={isMutating}
            onClick={edit}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-w-24 rounded-xl"
            disabled={isMutating}
            onClick={remove}
          >
            <Trash2 className="size-4" />
            Remove
          </Button>
        </Inline>
      </div>
    );
  }
);

BaseListItemRow.displayName = 'BaseListItemRow';

export { BaseListItemRow };
