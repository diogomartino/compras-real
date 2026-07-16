import { Media, StatusChip, Text } from '@/components/ds';
import { KebabMenu, type TKebabMenuItem } from '@/components/kebab-menu';
import { CardContextMenu } from '@/components/kebab-menu/card-context-menu';
import { Pencil, Trash2 } from 'lucide-react';
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

    const menuItems = useMemo<TKebabMenuItem[]>(
      () => [
        {
          key: 'edit',
          icon: <Pencil className="size-4" />,
          label: t('baseList.editQuantity'),
          onSelect: edit
        },
        {
          key: 'remove',
          icon: <Trash2 className="size-4" />,
          label: t('baseList.removeProduct'),
          onSelect: remove,
          variant: 'destructive'
        }
      ],
      [edit, remove, t]
    );

    return (
      <CardContextMenu items={menuItems}>
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

          <KebabMenu
            label={t('baseList.baseListItemActions')}
            disabled={isMutating}
            items={menuItems}
          />
        </div>
      </CardContextMenu>
    );
  }
);

BaseListItemRow.displayName = 'BaseListItemRow';

export { BaseListItemRow };
