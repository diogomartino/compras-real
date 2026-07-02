import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WandSparkles } from 'lucide-react';
import { memo, useMemo, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

type TCatalogImportCardProps = {
  value: string;
  isExtracting: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExtract: () => void;
};

const CatalogImportCard = memo(
  ({ value, isExtracting, onChange, onExtract }: TCatalogImportCardProps) => {
    const { t } = useTranslation();
    const extractDisabled = useMemo(() => isExtracting, [isExtracting]);

    return (
      <Surface variant="muted" radius="2xl" padding="md">
        <Stack gap="md">
          <Inline gap="sm" wrap={false}>
            <div className="grid size-10 place-items-center rounded-xl bg-background text-primary">
              <WandSparkles className="size-5" />
            </div>
            <Stack gap="none">
              <Text weight="semibold">{t('catalog.import.title')}</Text>
              <Text size="sm" tone="muted">
                {t('catalog.import.description')}
              </Text>
            </Stack>
          </Inline>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={onChange}
              className="h-11 rounded-xl bg-background"
              placeholder={t('catalog.import.url')}
            />
            <Button
              disabled={extractDisabled}
              type="button"
              variant="outline"
              onClick={onExtract}
            >
              {isExtracting
                ? t('catalog.import.extracting')
                : t('catalog.import.extract')}
            </Button>
          </div>
        </Stack>
      </Surface>
    );
  }
);

CatalogImportCard.displayName = 'CatalogImportCard';

export { CatalogImportCard };
