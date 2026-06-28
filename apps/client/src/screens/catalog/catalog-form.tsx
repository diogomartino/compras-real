import { Combobox, Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TTrpcErrors } from '@/helpers/parse-trpc-errors';
import { ArrowLeft } from 'lucide-react';
import {
  memo,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { formatUnit, unitOptions } from './helpers';
import type { TCatalogFormMode, TCatalogFormValues } from './types';
import { CatalogImportCard } from './catalog-import-card';
import { CatalogPreview } from './catalog-preview';

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
  onFieldChange: (
    field: keyof TCatalogFormValues,
    value: string | boolean
  ) => void;
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
    const categoryOptions = useMemo(
      () =>
        categories.map((category) => ({
          value: category,
          label: category
        })),
      [categories]
    );
    const getCreateCategoryLabel = useCallback(
      (category: string) => `Create "${category}"`,
      []
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
      (event: ChangeEvent<HTMLSelectElement>) => {
        onFieldChange('defaultQuantityUnit', event.target.value);
      },
      [onFieldChange]
    );
    const onArchivedChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('isArchived', event.target.checked);
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
                {formMode.type === 'create' ? 'Create product' : 'Save changes'}
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

                  <CatalogImportCard
                    value={values.sourceUrl}
                    isExtracting={isExtracting}
                    onChange={onImportUrlChange}
                    onExtract={onExtractDetails}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="space-y-2 sm:col-span-2">
                      <Text as="span" size="sm" weight="medium">
                        Product name
                      </Text>
                      <Input
                        value={values.title}
                        error={errors.title}
                        onChange={onTitleChange}
                        className="h-11 rounded-xl"
                        placeholder="Whole milk"
                      />
                    </label>

                    <label className="space-y-2 sm:col-span-2">
                      <Text as="span" size="sm" weight="medium">
                        Image URL
                      </Text>
                      <Input
                        value={values.imageUrl}
                        error={errors.imageUrl}
                        onChange={onImageUrlChange}
                        className="h-11 rounded-xl"
                        placeholder="https://example.com/image.jpg"
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        Category
                      </Text>
                      <Combobox
                        value={values.categoryName}
                        options={categoryOptions}
                        error={errors.categoryName}
                        allowCustomValue
                        emptyLabel="No categories yet."
                        createLabel={getCreateCategoryLabel}
                        onChange={onCategoryChange}
                        placeholder="Dairy or leave empty"
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        Source URL
                      </Text>
                      <Input
                        value={values.sourceUrl}
                        error={errors.sourceUrl}
                        onChange={onSourceUrlChange}
                        className="h-11 rounded-xl"
                        placeholder="Optional"
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        Default quantity
                      </Text>
                      <Input
                        type="number"
                        min="0"
                        step="0.001"
                        value={values.defaultQuantityAmount}
                        error={errors.defaultQuantityAmount}
                        onChange={onDefaultQuantityAmountChange}
                        className="h-11 rounded-xl"
                      />
                    </label>

                    <label className="space-y-2">
                      <Text as="span" size="sm" weight="medium">
                        Quantity unit
                      </Text>
                      <select
                        value={values.defaultQuantityUnit}
                        onChange={onDefaultQuantityUnitChange}
                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-11 w-full rounded-xl border bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                      >
                        {unitOptions.map((unit) => (
                          <option key={unit} value={unit}>
                            {formatUnit(unit)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex items-center gap-3 sm:col-span-2">
                      <input
                        checked={values.isArchived}
                        onChange={onArchivedChange}
                        type="checkbox"
                        className="size-4 rounded border-input accent-primary"
                      />
                      <Stack gap="none">
                        <Text as="span" size="sm" weight="medium">
                          Archived
                        </Text>
                        <Text size="xs" tone="muted">
                          Archived products are hidden from the catalog by
                          default.
                        </Text>
                      </Stack>
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
