import { Inline, Media, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { formatUnit } from './helpers';
import type { TCatalogProduct } from './types';

type TCatalogProductRowProps = {
  product: TCatalogProduct;
  isMutating: boolean;
  onEdit: (product: TCatalogProduct) => void;
  onDelete: (productId: string) => void;
};

const CatalogProductRow = memo(
  ({
    product,
    isMutating,
    onEdit,
    onDelete
  }: TCatalogProductRowProps) => {
    const quantity = useMemo(
      () => `${product.defaultQuantityAmount} ${formatUnit(product.defaultQuantityUnit)}`,
      [product.defaultQuantityAmount, product.defaultQuantityUnit]
    );
    const edit = useCallback(() => {
      onEdit(product);
    }, [onEdit, product]);
    const remove = useCallback(() => {
      onDelete(product.id);
    }, [onDelete, product.id]);

    return (
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-border bg-card p-3 transition-colors sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:p-4">
        <Media src={product.imageUrl} alt={product.title} size="lg" />

        <div className="min-w-0 space-y-1">
          <Inline gap="sm" wrap={false} className="min-w-0">
            <Text as="div" weight="semibold" className="truncate leading-tight">
              {product.title}
            </Text>
          </Inline>
          <Text size="sm" tone="muted" className="truncate">
            {product.categoryName ?? 'Uncategorized'} · {quantity}
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
            variant="destructive"
            size="sm"
            className="min-w-24 rounded-xl"
            disabled={isMutating}
            onClick={remove}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </Inline>
      </div>
    );
  }
);

CatalogProductRow.displayName = 'CatalogProductRow';

export { CatalogProductRow };
