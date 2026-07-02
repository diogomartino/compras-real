import {
  Inline,
  Media,
  Stack,
  StatusChip,
  Surface,
  Text
} from '@/components/ds';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatUnit } from './helpers';
import type { TCatalogFormValues } from './types';

type TCatalogPreviewProps = {
  form: TCatalogFormValues;
};

const CatalogPreview = memo(({ form }: TCatalogPreviewProps) => {
  const { t } = useTranslation();
  const title = useMemo(
    () => form.title || t('catalog.preview.emptyTitle'),
    [form.title, t]
  );
  const categoryName = useMemo(
    () => form.categoryName || t('catalog.preview.emptyCategory'),
    [form.categoryName, t]
  );
  const quantity = useMemo(
    () =>
      `${form.defaultQuantityAmount || '0'} ${formatUnit(form.defaultQuantityUnit)}`,
    [form.defaultQuantityAmount, form.defaultQuantityUnit]
  );

  return (
    <aside>
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
          </Inline>
        </Stack>
      </Surface>
    </aside>
  );
});

CatalogPreview.displayName = 'CatalogPreview';

export { CatalogPreview };
