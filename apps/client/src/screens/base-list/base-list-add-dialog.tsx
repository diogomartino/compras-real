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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { TUnitKind } from '@myapp/shared';
import { Check, Search } from 'lucide-react';
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent
} from 'react';
import { useTranslation } from 'react-i18next';
import { formatQuantity, unitOptions } from './helpers';
import type { TCatalogProduct } from './types';

type TSelection = { amount: string; unit: TUnitKind };

type TBaseListAddDialogProps = {
  open: boolean;
  products: TCatalogProduct[];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    items: {
      productId: string;
      quantityAmount: number;
      quantityUnit: TUnitKind;
    }[]
  ) => void;
};

const BaseListAddDialog = memo(
  ({
    open,
    products,
    isPending,
    onOpenChange,
    onSubmit
  }: TBaseListAddDialogProps) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<Map<string, TSelection>>(
      new Map()
    );

    const visibleProducts = useMemo(() => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        return products;
      }

      return products.filter((product) =>
        `${product.title} ${product.categoryName ?? ''}`
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }, [products, query]);

    const hasInvalidAmount = useMemo(
      () =>
        Array.from(selected.values()).some((selection) => {
          const amount = Number(selection.amount);

          return !amount || amount <= 0;
        }),
      [selected]
    );

    const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    }, []);

    const close = useCallback(() => {
      onOpenChange(false);
      setQuery('');
      setSelected(new Map());
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

    const toggleProduct = useCallback((product: TCatalogProduct) => {
      setSelected((current) => {
        const next = new Map(current);

        if (next.has(product.id)) {
          next.delete(product.id);
        } else {
          next.set(product.id, {
            amount: String(product.defaultQuantityAmount),
            unit: product.defaultQuantityUnit
          });
        }

        return next;
      });
    }, []);

    const setAmount = useCallback((productId: string, amount: string) => {
      setSelected((current) => {
        const selection = current.get(productId);

        if (!selection) {
          return current;
        }

        const next = new Map(current);

        next.set(productId, { ...selection, amount });

        return next;
      });
    }, []);

    const setUnit = useCallback((productId: string, unit: TUnitKind) => {
      setSelected((current) => {
        const selection = current.get(productId);

        if (!selection) {
          return current;
        }

        const next = new Map(current);

        next.set(productId, { ...selection, unit });

        return next;
      });
    }, []);

    const submit = useCallback(() => {
      onSubmit(
        Array.from(selected.entries()).map(([productId, selection]) => ({
          productId,
          quantityAmount: Number(selection.amount),
          quantityUnit: selection.unit
        }))
      );
    }, [onSubmit, selected]);

    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-h-[calc(100dvh-1rem)] gap-5 overflow-hidden p-4 sm:max-w-2xl sm:p-6"
          close={close}
        >
          <DialogHeader>
            <DialogTitle>{t('baseList.addDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('baseList.addDialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={onQueryChange}
              className="pl-9"
              placeholder={t('baseList.searchProducts')}
            />
          </div>

          <div className="max-h-[55dvh] space-y-2 overflow-y-auto pr-1">
            {visibleProducts.length === 0 && (
              <p className="px-1 py-6 text-center text-sm text-muted-foreground">
                {t('baseList.addDialog.empty')}
              </p>
            )}

            {visibleProducts.map((product) => {
              const selection = selected.get(product.id);
              const isSelected = !!selection;

              return (
                <div
                  key={product.id}
                  className={cn(
                    'overflow-hidden rounded-xl border transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border/70 bg-card/75'
                  )}
                >
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => toggleProduct(product)}
                    className="grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 text-left"
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
                        <StatusChip tone="info">
                          {formatQuantity(
                            product.defaultQuantityAmount,
                            product.defaultQuantityUnit
                          )}
                        </StatusChip>
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

                  {selection && (
                    <div className="grid grid-cols-2 gap-3 border-t border-border/70 px-3 py-3">
                      <label className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('baseList.quantity')}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.001"
                          value={selection.amount}
                          disabled={isPending}
                          onChange={(event) =>
                            setAmount(product.id, event.target.value)
                          }
                        />
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('baseList.unit')}
                        </span>
                        <Select
                          value={selection.unit}
                          onValueChange={(value) =>
                            setUnit(product.id, value as TUnitKind)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              disabled={isPending || selected.size === 0 || hasInvalidAmount}
              onClick={submit}
            >
              {t('baseList.addDialog.addSelected', { count: selected.size })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

BaseListAddDialog.displayName = 'BaseListAddDialog';

export { BaseListAddDialog };
