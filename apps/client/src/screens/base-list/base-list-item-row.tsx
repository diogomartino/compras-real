import { Media, StatusChip, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/70 bg-card/75 p-3 transition-colors active:bg-accent/35 sm:p-4">
        <Media src={item.imageUrl} alt={item.title} size="lg" />

        <div className="min-w-0 space-y-2">
          <Text as="div" weight="semibold" className="truncate leading-tight">
            {item.title}
          </Text>
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <StatusChip tone="muted">
              {item.categoryName ?? t('common.uncategorized')}
            </StatusChip>
            <StatusChip tone="info">{quantity}</StatusChip>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              disabled={isMutating}
              aria-label={t('baseList.baseListItemActions')}
            >
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem onSelect={edit}>
              <Pencil className="size-4" />
              {t('baseList.editQuantity')}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={remove}>
              <Trash2 className="size-4" />
              {t('baseList.removeProduct')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

BaseListItemRow.displayName = 'BaseListItemRow';

export { BaseListItemRow };
