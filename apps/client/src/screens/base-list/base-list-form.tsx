import { Inline, Media, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { TTrpcErrors } from '@/helpers/parse-trpc-errors';
import { ArrowLeft } from 'lucide-react';
import {
  memo,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { formatQuantity, unitOptions } from './helpers';
import type {
  TBaseListItemFormMode,
  TBaseListItemFormValues,
  TCatalogProduct
} from './types';

type TBaseListFormProps = {
  formMode: TBaseListItemFormMode;
  values: TBaseListItemFormValues;
  productOptions: TCatalogProduct[];
  errors: TTrpcErrors;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onProductChange: (productId: string) => void;
  onFieldChange: (
    field: keyof TBaseListItemFormValues,
    value: TBaseListItemFormValues[keyof TBaseListItemFormValues]
  ) => void;
};

const BaseListForm = memo(
  ({
    formMode,
    values,
    productOptions,
    errors,
    isPending,
    onCancel,
    onSubmit,
    onProductChange,
    onFieldChange
  }: TBaseListFormProps) => {
    const selectedProduct = useMemo(
      () => productOptions.find((product) => product.id === values.productId),
      [productOptions, values.productId]
    );
    const previewTitle = useMemo(() => {
      if (formMode.type === 'edit') {
        return formMode.productName;
      }

      return selectedProduct?.title ?? 'Choose a product';
    }, [formMode, selectedProduct]);
    const previewImageUrl = useMemo(
      () => selectedProduct?.imageUrl ?? null,
      [selectedProduct]
    );
    const previewCategoryName = useMemo(
      () => selectedProduct?.categoryName ?? 'Uncategorized',
      [selectedProduct]
    );
    const previewQuantity = useMemo(
      () => formatQuantity(values.quantityAmount || '0', values.quantityUnit),
      [values.quantityAmount, values.quantityUnit]
    );
    const onSelectedProductChange = useCallback(
      (value: string) => {
        onProductChange(value);
      },
      [onProductChange]
    );
    const onQuantityAmountChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('quantityAmount', event.target.value);
      },
      [onFieldChange]
    );
    const onQuantityUnitChange = useCallback(
      (value: string) => {
        onFieldChange(
          'quantityUnit',
          value as TBaseListItemFormValues['quantityUnit']
        );
      },
      [onFieldChange]
    );

    return (
      <main className="min-h-dvh bg-background text-foreground">
        <form
          className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8"
          onSubmit={onSubmit}
        >
          <Inline justify="between" wrap={false} className="mb-6 gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Inline gap="sm" wrap={false}>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {formMode.type === 'create' ? 'Add product' : 'Save quantity'}
              </Button>
            </Inline>
          </Inline>

          <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Stack gap="lg">
              <Surface radius="2xl" padding="lg">
                <Stack gap="lg">
                  {errors._general && (
                    <Text tone="destructive" role="alert">
                      {errors._general}
                    </Text>
                  )}

                  <Stack gap="sm">
                    <Text weight="semibold">
                      {formMode.type === 'create'
                        ? 'Add catalog product'
                        : 'Edit base quantity'}
                    </Text>
                    <Text size="sm" tone="muted">
                      Products in enabled base lists are automatically included
                      whenever a shopping session starts.
                    </Text>
                  </Stack>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {formMode.type === 'create' ? (
                      <label className="space-y-2 sm:col-span-2">
                        <Text as="span" size="sm" weight="medium">
                          Product
                        </Text>
                        <Select
                          value={values.productId}
                          onValueChange={onSelectedProductChange}
                        >
                          <SelectTrigger className="h-11 w-full rounded-xl">
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                          <SelectContent>
                            {productOptions.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.title}
                                {product.categoryName
                                  ? ` · ${product.categoryName}`
                                  : ' · Uncategorized'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.productId && (
                          <Text size="sm" tone="destructive">
                            {errors.productId}
                          </Text>
                        )}
                      </label>
                    ) : (
                      <Stack gap="xs" className="sm:col-span-2">
                        <Text size="sm" weight="medium">
                          Product
                        </Text>
                        <Text>{formMode.productName}</Text>
                      </Stack>
                    )}

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        Quantity
                      </Text>
                      <Input
                        type="number"
                        min="0"
                        step="0.001"
                        value={values.quantityAmount}
                        error={errors.quantityAmount}
                        onChange={onQuantityAmountChange}
                        className="h-11 rounded-xl"
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        Unit
                      </Text>
                      <Select
                        value={values.quantityUnit}
                        onValueChange={onQuantityUnitChange}
                      >
                        <SelectTrigger className="h-11 w-full rounded-xl">
                          <SelectValue placeholder="Select unit" />
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
                </Stack>
              </Surface>
            </Stack>

            <aside>
              <Surface radius="2xl" padding="lg" className="sticky top-6">
                <Stack gap="md">
                  <Media src={previewImageUrl} alt={previewTitle} size="xl" />
                  <Stack gap="xs">
                    <Text weight="semibold">{previewTitle}</Text>
                    <Text size="sm" tone="muted">
                      {previewCategoryName}
                    </Text>
                  </Stack>
                  <Text size="sm" tone="muted">
                    {previewQuantity}
                  </Text>
                </Stack>
              </Surface>
            </aside>
          </div>
        </form>
      </main>
    );
  }
);

BaseListForm.displayName = 'BaseListForm';

export { BaseListForm };
