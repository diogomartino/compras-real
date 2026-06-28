import {
  Inline,
  Media,
  Stack,
  StatusChip,
  Surface,
  Text
} from '@/components/ds';
import { memo, useMemo } from 'react';
import { formatUnit } from './helpers';
import type { TCatalogFormValues } from './types';

type TCatalogPreviewProps = {
  form: TCatalogFormValues;
};

const CatalogPreview = memo(({ form }: TCatalogPreviewProps) => {
  const title = useMemo(() => form.title || 'Product preview', [form.title]);
  const categoryName = useMemo(
    () => form.categoryName || 'No category yet',
    [form.categoryName]
  );
  const quantity = useMemo(
    () => `${form.defaultQuantityAmount || '0'} ${formatUnit(form.defaultQuantityUnit)}`,
    [form.defaultQuantityAmount, form.defaultQuantityUnit]
  );

  return (
    <aside className="lg:pt-28">
      <Surface radius="2xl" padding="lg" className="sticky top-6">
        <Stack gap="md">
          <Media src={form.imageUrl} alt={form.title} size="xl" />
          <Stack gap="xs">
            <Text weight="semibold">{title}</Text>
            <Text size="sm" tone="muted">
              {categoryName}
            </Text>
          </Stack>
          <Inline gap="sm">
            <StatusChip tone="info">{quantity}</StatusChip>
            {form.isArchived && (
              <StatusChip tone="skipped">Archived</StatusChip>
            )}
          </Inline>
        </Stack>
      </Surface>
    </aside>
  );
});

CatalogPreview.displayName = 'CatalogPreview';

export { CatalogPreview };
