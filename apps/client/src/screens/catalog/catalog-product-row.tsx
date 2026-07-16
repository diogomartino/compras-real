import { Media, StatusChip, Text } from '@/components/ds';
import { KebabMenu, type TKebabMenuItem } from '@/components/kebab-menu';
import { CardContextMenu } from '@/components/kebab-menu/card-context-menu';
import { Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUnit } from './helpers';
import type { TCatalogProduct } from './types';

type TCatalogProductRowProps = {
  product: TCatalogProduct;
  isMutating: boolean;
  onEdit: (product: TCatalogProduct) => void;
  onDelete: (productId: string) => void;
};

const CatalogProductRow = memo(
  ({ product, isMutating, onEdit, onDelete }: TCatalogProductRowProps) => {
    const { t } = useTranslation();
    const quantity = useMemo(
      () =>
        `${product.defaultQuantityAmount} ${formatUnit(product.defaultQuantityUnit)}`,
      [product.defaultQuantityAmount, product.defaultQuantityUnit]
    );
    const edit = useCallback(() => {
      onEdit(product);
    }, [onEdit, product]);
    const remove = useCallback(() => {
      onDelete(product.id);
    }, [onDelete, product.id]);

    const menuItems = useMemo<TKebabMenuItem[]>(
      () => [
        {
          key: 'edit',
          icon: <Pencil className="size-4" />,
          label: t('catalog.editProduct'),
          onSelect: edit
        },
        {
          key: 'delete',
          icon: <Trash2 className="size-4" />,
          label: t('catalog.deleteProduct'),
          onSelect: remove,
          variant: 'destructive'
        }
      ],
      [edit, remove, t]
    );

    return (
      <CardContextMenu items={menuItems}>
        <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/70 bg-card/75 p-3 transition-colors active:bg-accent/35 sm:p-4">
          <Media src={product.imageUrl} alt={product.title} size="lg" />

          <div className="min-w-0 space-y-2">
            <Text as="div" weight="semibold" className="truncate leading-tight">
              {product.title}
            </Text>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <StatusChip tone="muted">
                {product.categoryName ?? t('common.uncategorized')}
              </StatusChip>
              <StatusChip tone="info">{quantity}</StatusChip>
            </div>
          </div>

          <KebabMenu
            label={t('catalog.productActions')}
            disabled={isMutating}
            items={menuItems}
          />
        </div>
      </CardContextMenu>
    );
  }
);

CatalogProductRow.displayName = 'CatalogProductRow';

export { CatalogProductRow };
