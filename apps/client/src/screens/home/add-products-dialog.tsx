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
import { useTranslation } from 'react-i18next';
import { formatQuantity } from './helpers';

type TAddProductsDialogProps = {
  open: boolean;
  products: TCatalogProduct[];
  recentProducts: TCatalogProduct[];
  ongoingItems: TOngoingListEntry[];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (productIds: string[]) => void;
};

const AddProductsDialog = memo(
  ({
    open,
    products,
    recentProducts,
    ongoingItems,
    isPending,
    onOpenChange,
    onSubmit
  }: TAddProductsDialogProps) => {
    const { t } = useTranslation();
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
    const normalizedQuery = query.trim().toLowerCase();
    const availableRecentProducts = useMemo(
      () =>
        recentProducts.filter((product) => !ongoingProductIds.has(product.id)),
      [ongoingProductIds, recentProducts]
    );
    const recentProductIds = useMemo(
      () => new Set(availableRecentProducts.map((product) => product.id)),
      [availableRecentProducts]
    );
    const allSectionProducts = useMemo(() => {
      if (normalizedQuery) {
        return visibleProducts;
      }

      return visibleProducts.filter(
        (product) => !recentProductIds.has(product.id)
      );
    }, [normalizedQuery, recentProductIds, visibleProducts]);
    const onQueryChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
      },
      []
    );
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
    const renderProduct = useCallback(
      (product: TCatalogProduct) => {
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
              'grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3 text-left transition-colors',
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-border/70 bg-card/75 hover:bg-accent/40',
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
                  {product.categoryName ?? t('common.uncategorized')}
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
      },
      [isPending, ongoingProductIds, selectedProductIds, t, toggleProduct]
    );

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-h-[calc(100dvh-1rem)] gap-5 overflow-hidden p-4 sm:max-w-3xl sm:p-6"
          close={close}
        >
          <DialogHeader>
            <DialogTitle>{t('home.addDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('home.addDialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={onQueryChange}
              className="pl-9"
              placeholder={t('home.addDialog.search')}
            />
          </div>

          <div className="max-h-[55dvh] space-y-4 overflow-y-auto pr-1">
            {!normalizedQuery && availableRecentProducts.length > 0 && (
              <Stack gap="sm">
                <span className="px-1 text-sm font-semibold">
                  {t('home.addDialog.recentProducts')}
                </span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {availableRecentProducts.map(renderProduct)}
                </div>
              </Stack>
            )}

            <Stack gap="sm">
              {!normalizedQuery && (
                <span className="px-1 text-sm font-semibold">
                  {t('home.addDialog.allProducts')}
                </span>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {allSectionProducts.map(renderProduct)}
              </div>
            </Stack>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              disabled={isPending || selectedProductIds.length === 0}
              onClick={submit}
            >
              {t('home.addDialog.addSelected', {
                count: selectedProductIds.length
              })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

AddProductsDialog.displayName = 'AddProductsDialog';

export { AddProductsDialog };
