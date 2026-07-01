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
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-colors sm:p-4">
        <Media src={product.imageUrl} alt={product.title} size="lg" />

        <div className="min-w-0 space-y-2">
          <Text as="div" weight="semibold" className="truncate leading-tight">
            {product.title}
          </Text>
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <StatusChip tone="muted">
              {product.categoryName ?? 'Uncategorized'}
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
              aria-label="Product actions"
            >
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem onSelect={edit}>
              <Pencil className="size-4" />
              Edit product
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={remove}>
              <Trash2 className="size-4" />
              Delete product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

CatalogProductRow.displayName = 'CatalogProductRow';

export { CatalogProductRow };
