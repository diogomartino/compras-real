import { Media, Stack, StatusChip } from '@/components/ds';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TCatalogProduct, TOngoingListEntry } from '@myapp/shared';
import { Check, Search } from 'lucide-react';
import { memo, useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { formatQuantity } from './helpers';

type TAddProductsDialogProps = {
  open: boolean;
  products: TCatalogProduct[];
  ongoingItems: TOngoingListEntry[];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productIds: string[]) => void;
};

const AddProductsDialog = memo(
  ({
    open,
    products,
    ongoingItems,
    isPending,
    onOpenChange,
    onSubmit
  }: TAddProductsDialogProps) => {
    const [query, setQuery] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const ongoingProductIds = useMemo(
      () => new Set(ongoingItems.map((item) => item.productId)),
      [ongoingItems]
    );
    const visibleProducts = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();

      return products.filter((product) => {
        if (!normalizedQuery) {
          return true;
        }

        return `${product.title} ${product.categoryName ?? ''}`
          .toLowerCase()
          .includes(normalizedQuery);
      });
    }, [products, query]);
    const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    }, []);
    const close = useCallback(() => {
      onOpenChange(false);
      setQuery('');
      setSelectedProductIds([]);
    }, [onOpenChange]);
    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (!nextOpen) {
          close();
          return;
        }

        onOpenChange(true);
      },
      [close, onOpenChange]
    );
    const toggleProduct = useCallback(
      (productId: string) => {
        if (ongoingProductIds.has(productId)) {
          return;
        }

        setSelectedProductIds((currentIds) => {
          if (currentIds.includes(productId)) {
            return currentIds.filter((id) => id !== productId);
          }

          return [...currentIds, productId];
        });
      },
      [ongoingProductIds]
    );
    const submit = useCallback(() => {
      onSubmit(selectedProductIds);
    }, [onSubmit, selectedProductIds]);

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] gap-5 overflow-hidden rounded-3xl p-4 sm:max-w-3xl sm:p-6" close={close}>
          <DialogHeader>
            <DialogTitle>Add products</DialogTitle>
            <DialogDescription>
              Select catalog products to add to the current ongoing list.
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={onQueryChange}
              className="h-11 rounded-xl pl-9"
              placeholder="Search catalog"
            />
          </div>

          <div className="grid max-h-[55dvh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {visibleProducts.map((product) => {
              const isAdded = ongoingProductIds.has(product.id);
              const isSelected = selectedProductIds.includes(product.id);
              const quantity = formatQuantity(
                product.defaultQuantityAmount,
                product.defaultQuantityUnit
              );

              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={isAdded || isPending}
                  onClick={() => toggleProduct(product.id)}
                  className={cn(
                    'grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-accent/40',
                    isAdded && 'opacity-50'
                  )}
                >
                  <Media src={product.imageUrl} alt={product.title} size="md" />
                  <Stack gap="xs" className="min-w-0">
                    <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold leading-tight">
                      {product.title}
                    </span>
                    <div className="flex min-w-0 flex-wrap gap-1.5">
                      <StatusChip tone="muted">
                        {product.categoryName ?? 'Uncategorized'}
                      </StatusChip>
                      <StatusChip tone="info">{quantity}</StatusChip>
                    </div>
                  </Stack>
                  <div
                    className={cn(
                      'grid size-7 place-items-center rounded-full border',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background'
                    )}
                  >
                    {isSelected && <Check className="size-4" />}
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isPending || selectedProductIds.length === 0}
              onClick={submit}
            >
              Add selected ({selectedProductIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

AddProductsDialog.displayName = 'AddProductsDialog';

export { AddProductsDialog };
