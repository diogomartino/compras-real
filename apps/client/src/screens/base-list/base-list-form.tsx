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
import { useFullscreenScreen } from '@/features/app/hooks';
import type { TTrpcErrors } from '@/helpers/parse-trpc-errors';
import { ArrowLeft } from 'lucide-react';
import {
  memo,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    useFullscreenScreen();
    const selectedProduct = useMemo(
      () => productOptions.find((product) => product.id === values.productId),
      [productOptions, values.productId]
    );
    const previewTitle = useMemo(() => {
      if (formMode.type === 'edit') {
        return formMode.productName;
      }

      return selectedProduct?.title ?? t('baseList.chooseProduct');
    }, [formMode, selectedProduct, t]);
    const previewImageUrl = useMemo(
      () => selectedProduct?.imageUrl ?? null,
      [selectedProduct]
    );
    const previewCategoryName = useMemo(
      () => selectedProduct?.categoryName ?? t('common.uncategorized'),
      [selectedProduct, t]
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
          className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-4 py-4 sm:px-6"
          onSubmit={onSubmit}
        >
          <Inline justify="between" wrap={false} className="mb-6 gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              <ArrowLeft className="size-4" />
              {t('baseList.back')}
            </Button>
            <Inline gap="sm" wrap={false}>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {formMode.type === 'create'
                  ? t('baseList.addProduct')
                  : t('baseList.saveQuantity')}
              </Button>
            </Inline>
          </Inline>

          <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <Stack gap="lg">
              <Surface radius="xl" padding="lg">
                <Stack gap="lg">
                  {errors._general && (
                    <Text tone="destructive" role="alert">
                      {errors._general}
                    </Text>
                  )}

                  <Stack gap="sm">
                    <Text weight="semibold">
                      {formMode.type === 'create'
                        ? t('baseList.addCatalogProduct')
                        : t('baseList.editBaseQuantity')}
                    </Text>
                    <Text size="sm" tone="muted">
                      {t('baseList.autoIncludedDescription')}
                    </Text>
                  </Stack>

                  <div className="grid gap-5 sm:grid-cols-2">
                    {formMode.type === 'create' ? (
                      <label className="space-y-2 sm:col-span-2">
                        <Text as="span" size="sm" weight="medium">
                          {t('baseList.product')}
                        </Text>
                        <Select
                          value={values.productId}
                          onValueChange={onSelectedProductChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={t('baseList.selectProduct')} />
                          </SelectTrigger>
                          <SelectContent>
                            {productOptions.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.title}
                                {product.categoryName
                                  ? ` · ${product.categoryName}`
                                   : ` · ${t('common.uncategorized')}`}
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
                          {t('baseList.product')}
                        </Text>
                        <Text>{formMode.productName}</Text>
                      </Stack>
                    )}

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('baseList.quantity')}
                      </Text>
                      <Input
                        type="number"
                        min="0"
                        step="0.001"
                        value={values.quantityAmount}
                        error={errors.quantityAmount}
                        onChange={onQuantityAmountChange}
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('baseList.unit')}
                      </Text>
                      <Select
                        value={values.quantityUnit}
                        onValueChange={onQuantityUnitChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('baseList.selectUnit')} />
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
              <Surface radius="xl" padding="lg" className="sticky top-6">
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
