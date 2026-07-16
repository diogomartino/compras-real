import { Media, StatusChip, Text } from '@/components/ds';
import { KebabMenu, type TKebabMenuItem } from '@/components/kebab-menu';
import { CardContextMenu } from '@/components/kebab-menu/card-context-menu';
import { QuantityStepper } from '@/components/quantity-stepper';
import type { TOngoingListEntry } from '@myapp/shared';
import { Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type TOngoingListItemRowProps = {
  item: TOngoingListEntry;
  isMutating: boolean;
  onEdit: (item: TOngoingListEntry) => void;
  onRemove: (item: TOngoingListEntry) => void;
  onQuantityChange: (item: TOngoingListEntry, quantityAmount: number) => void;
};

const OngoingListItemRow = memo(
  ({
    item,
    isMutating,
    onEdit,
    onRemove,
    onQuantityChange
  }: TOngoingListItemRowProps) => {
    const { t } = useTranslation();
    const edit = useCallback(() => {
      onEdit(item);
    }, [item, onEdit]);
    const remove = useCallback(() => {
      onRemove(item);
    }, [item, onRemove]);
    const changeQuantity = useCallback(
      (quantityAmount: number) => {
        onQuantityChange(item, quantityAmount);
      },
      [item, onQuantityChange]
    );

    const menuItems = useMemo<TKebabMenuItem[]>(
      () => [
        {
          key: 'edit',
          icon: <Pencil className="size-4" />,
          label: t('home.editQuantity.title'),
          onSelect: edit
        },
        {
          key: 'remove',
          icon: <Trash2 className="size-4" />,
          label: t('home.removeProductTitle'),
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
              <QuantityStepper
                amount={item.quantityAmount}
                unit={item.quantityUnit}
                disabled={isMutating}
                onChange={changeQuantity}
              />
            </div>
          </div>

          <KebabMenu
            label={t('home.ongoingProductActions')}
            disabled={isMutating}
            items={menuItems}
          />
        </div>
      </CardContextMenu>
    );
  }
);

OngoingListItemRow.displayName = 'OngoingListItemRow';

export { OngoingListItemRow };
