import { Combobox, Inline, Stack, Surface, Text } from '@/components/ds';
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
import { CatalogImportCard } from './catalog-import-card';
import { CatalogPreview } from './catalog-preview';
import { formatUnit, unitOptions } from './helpers';
import type { TCatalogFormMode, TCatalogFormValues } from './types';

type TCatalogFormProps = {
  formMode: TCatalogFormMode;
  values: TCatalogFormValues;
  categories: string[];
  errors: TTrpcErrors;
  isPending: boolean;
  isExtracting: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onImportUrlChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExtractDetails: () => void;
  onFieldChange: (field: keyof TCatalogFormValues, value: string) => void;
};

const CatalogForm = memo(
  ({
    formMode,
    values,
    categories,
    errors,
    isPending,
    isExtracting,
    onCancel,
    onSubmit,
    onImportUrlChange,
    onExtractDetails,
    onFieldChange
  }: TCatalogFormProps) => {
    const { t } = useTranslation();

    useFullscreenScreen();

    const categoryOptions = useMemo(
      () =>
        categories.map((category) => ({
          value: category,
          label: category
        })),
      [categories]
    );
    const getCreateCategoryLabel = useCallback(
      (category: string) => t('catalog.form.createCategory', { category }),
      [t]
    );
    const onTitleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('title', event.target.value);
      },
      [onFieldChange]
    );
    const onImageUrlChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('imageUrl', event.target.value);
      },
      [onFieldChange]
    );
    const onCategoryChange = useCallback(
      (value: string) => {
        onFieldChange('categoryName', value);
      },
      [onFieldChange]
    );
    const onSourceUrlChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('sourceUrl', event.target.value);
      },
      [onFieldChange]
    );
    const onDefaultQuantityAmountChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('defaultQuantityAmount', event.target.value);
      },
      [onFieldChange]
    );
    const onDefaultQuantityUnitChange = useCallback(
      (value: string) => {
        onFieldChange('defaultQuantityUnit', value);
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
              {t('catalog.form.back')}
            </Button>
            <Inline gap="sm" wrap={false}>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {formMode.type === 'create'
                  ? t('catalog.form.createProduct')
                  : t('catalog.form.saveChanges')}
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

                  <CatalogImportCard
                    value={values.sourceUrl}
                    isExtracting={isExtracting}
                    onChange={onImportUrlChange}
                    onExtract={onExtractDetails}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="space-y-2 sm:col-span-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('catalog.form.productName')}
                      </Text>
                      <Input
                        value={values.title}
                        error={errors.title}
                        onChange={onTitleChange}
                        placeholder={t('catalog.form.productNamePlaceholder')}
                      />
                    </label>

                    <label className="space-y-2 sm:col-span-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('catalog.form.imageUrl')}
                      </Text>
                      <Input
                        value={values.imageUrl}
                        error={errors.imageUrl}
                        onChange={onImageUrlChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('catalog.form.category')}
                      </Text>
                      <Combobox
                        value={values.categoryName}
                        options={categoryOptions}
                        error={errors.categoryName}
                        allowCustomValue
                        emptyLabel={t('catalog.form.noCategoriesYet')}
                        createLabel={getCreateCategoryLabel}
                        onChange={onCategoryChange}
                        placeholder={t('catalog.form.categoryPlaceholder')}
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('catalog.form.sourceUrl')}
                      </Text>
                      <Input
                        value={values.sourceUrl}
                        error={errors.sourceUrl}
                        onChange={onSourceUrlChange}
                        placeholder={t('catalog.form.optional')}
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('catalog.form.defaultQuantity')}
                      </Text>
                      <Input
                        type="number"
                        min="0"
                        step="0.001"
                        value={values.defaultQuantityAmount}
                        error={errors.defaultQuantityAmount}
                        onChange={onDefaultQuantityAmountChange}
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        {t('catalog.form.quantityUnit')}
                      </Text>
                      <Select
                        value={values.defaultQuantityUnit}
                        onValueChange={onDefaultQuantityUnitChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t('catalog.form.selectUnit')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {formatUnit(unit)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                  </div>
                </Stack>
              </Surface>
            </Stack>

            <CatalogPreview form={values} />
          </div>
        </form>
      </main>
    );
  }
);

CatalogForm.displayName = 'CatalogForm';

export { CatalogForm };
