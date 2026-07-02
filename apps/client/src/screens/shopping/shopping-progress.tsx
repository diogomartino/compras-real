import { Inline, Stack, Text } from '@/components/ds';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type TShoppingProgressProps = {
  checkedCount: number;
  totalCount: number;
  overlay?: boolean;
};

const ShoppingProgress = memo(
  ({ checkedCount, totalCount, overlay = false }: TShoppingProgressProps) => {
    const { t } = useTranslation();
    const progress = useMemo(() => {
      if (totalCount === 0) {
        return 0;
      }

      return Math.round((checkedCount / totalCount) * 100);
    }, [checkedCount, totalCount]);

    return (
      <Stack gap="xs">
        <Inline justify="between" wrap={false}>
          <Text weight="semibold">{t('shopping.presenceActive')}</Text>
          <Text size="sm" tone={overlay ? undefined : 'muted'}>
            {checkedCount}/{totalCount}
          </Text>
        </Inline>
        <div
          className={cn(
            'h-2 overflow-hidden rounded-full',
            overlay ? 'bg-white/25' : 'bg-muted'
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              overlay ? 'bg-white' : 'bg-primary'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </Stack>
    );
  }
);

ShoppingProgress.displayName = 'ShoppingProgress';

export { ShoppingProgress };
