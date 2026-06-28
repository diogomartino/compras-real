import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WandSparkles } from 'lucide-react';
import { memo, useMemo, type ChangeEvent } from 'react';

type TCatalogImportCardProps = {
  value: string;
  isExtracting: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onExtract: () => void;
};

const CatalogImportCard = memo(
  ({ value, isExtracting, onChange, onExtract }: TCatalogImportCardProps) => {
    const extractDisabled = useMemo(() => isExtracting, [isExtracting]);

    return (
      <Surface variant="muted" radius="2xl" padding="md">
        <Stack gap="md">
          <Inline gap="sm" wrap={false}>
            <div className="grid size-10 place-items-center rounded-xl bg-background text-primary">
              <WandSparkles className="size-5" />
            </div>
            <Stack gap="none">
              <Text weight="semibold">Import from link</Text>
              <Text size="sm" tone="muted">
                Extract product details from a supported product page.
              </Text>
            </Stack>
          </Inline>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={onChange}
              className="h-11 rounded-xl bg-background"
              placeholder="Paste a product page URL"
            />
            <Button
              disabled={extractDisabled}
              type="button"
              variant="outline"
              onClick={onExtract}
            >
              {isExtracting ? 'Extracting...' : 'Extract details'}
            </Button>
          </div>
        </Stack>
      </Surface>
    );
  }
);

CatalogImportCard.displayName = 'CatalogImportCard';

export { CatalogImportCard };
