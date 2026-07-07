import { Inline, Stack, StatusChip, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useAuth } from '@/features/auth/hooks';
import type { TOngoingListDetails } from '@myapp/shared';
import { AlertTriangle, ImageOff, ShoppingCart } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type TStartShoppingDialogProps = {
  open: boolean;
  ongoingList: TOngoingListDetails | undefined;
  isLoading: boolean;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewList: () => void;
  onAddProducts: () => void;
  onStartShopping: () => void;
};

const StartShoppingDialog = memo(
  ({
    open,
    ongoingList,
    isLoading,
    isPending,
    onOpenChange,
    onReviewList,
    onAddProducts,
    onStartShopping
  }: TStartShoppingDialogProps) => {
    const { t } = useTranslation();
    const auth = useAuth();
    const items = useMemo(() => ongoingList?.items ?? [], [ongoingList]);
    const categoryGroups = useMemo(() => {
      const groups = new Map<string, number>();

      items.forEach((item) => {
        const categoryName = item.categoryName ?? t('common.uncategorized');

        groups.set(categoryName, (groups.get(categoryName) ?? 0) + 1);
      });

      return Array.from(groups.entries())
        .map(([categoryName, count]) => ({ categoryName, count }))
        .sort((firstGroup, secondGroup) => {
          if (firstGroup.categoryName === t('common.uncategorized')) {
            return 1;
          }

          if (secondGroup.categoryName === t('common.uncategorized')) {
            return -1;
          }

          return firstGroup.categoryName.localeCompare(
            secondGroup.categoryName
          );
        });
    }, [items, t]);
    const uncategorizedCount = useMemo(
      () => items.filter((item) => !item.categoryName).length,
      [items]
    );
    const missingImageCount = useMemo(
      () => items.filter((item) => !item.imageUrl).length,
      [items]
    );
    const defaultMode = auth.settings?.defaultShoppingMode ?? 'list';
    const hasItems = items.length > 0;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          close={() => onOpenChange(false)}
          className="gap-5 sm:max-w-xl"
        >
          <DialogHeader>
            <DialogTitle>{t('components.startShopping.title')}</DialogTitle>
            <DialogDescription>
              {t('components.startShopping.description')}
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <Surface radius="xl" padding="lg" variant="muted">
              <Text tone="muted">{t('components.startShopping.loading')}</Text>
            </Surface>
          )}

          {!isLoading && !hasItems && (
            <Surface radius="xl" padding="lg" className="text-center">
              <Stack gap="md" align="center">
                <ShoppingCart className="size-10 text-muted-foreground" />
                <Stack gap="xs" align="center">
                  <Text weight="semibold">
                    {t('components.startShopping.emptyTitle')}
                  </Text>
                  <Text size="sm" tone="muted">
                    {t('components.startShopping.emptyDescription')}
                  </Text>
                </Stack>
                <Button type="button" onClick={onAddProducts}>
                  {t('components.startShopping.addProducts')}
                </Button>
              </Stack>
            </Surface>
          )}

          {!isLoading && hasItems && (
            <Stack gap="md">
              <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border/70 bg-card/70 text-center">
                <div className="border-r border-border/70 p-3">
                  <Text weight="semibold">{items.length}</Text>
                  <Text size="xs" tone="muted">
                    {t('components.startShopping.products')}
                  </Text>
                </div>
                <div className="border-r border-border/70 p-3">
                  <Text weight="semibold">{categoryGroups.length}</Text>
                  <Text size="xs" tone="muted">
                    {t('components.startShopping.categories')}
                  </Text>
                </div>
                <div className="p-3">
                  <Text weight="semibold" className="capitalize">
                    {defaultMode}
                  </Text>
                  <Text size="xs" tone="muted">
                    {t('components.startShopping.defaultMode')}
                  </Text>
                </div>
              </div>

              {(uncategorizedCount > 0 || missingImageCount > 0) && (
                <Stack gap="sm">
                  {uncategorizedCount > 0 && (
                    <Inline
                      gap="sm"
                      wrap={false}
                      className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-orange-900"
                    >
                      <AlertTriangle className="size-4 shrink-0" />
                      <Text size="sm">
                        {t('components.startShopping.uncategorizedWarning', {
                          count: uncategorizedCount
                        })}
                      </Text>
                    </Inline>
                  )}
                  {missingImageCount > 0 && (
                    <Inline
                      gap="sm"
                      wrap={false}
                      className="rounded-xl border border-muted bg-muted/60 px-3 py-2"
                    >
                      <ImageOff className="size-4 shrink-0 text-muted-foreground" />
                      <Text size="sm">
                        {t('components.startShopping.missingImageWarning', {
                          count: missingImageCount
                        })}
                      </Text>
                    </Inline>
                  )}
                </Stack>
              )}

              <Stack gap="sm">
                <Text size="sm" weight="semibold">
                  {t('components.startShopping.categories')}
                </Text>
                <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto rounded-xl border border-border/70 p-3">
                  {categoryGroups.map((group) => (
                    <StatusChip key={group.categoryName}>
                      {group.categoryName}
                      <span className="text-xs opacity-70">{group.count}</span>
                    </StatusChip>
                  ))}
                </div>
              </Stack>
            </Stack>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            {hasItems && (
              <Button type="button" variant="outline" onClick={onReviewList}>
                {t('components.startShopping.reviewList')}
              </Button>
            )}
            {hasItems && (
              <Button type="button" disabled={isPending} onClick={onStartShopping}>
                {isPending
                  ? t('components.startShopping.starting')
                  : t('components.startShopping.startShopping')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

StartShoppingDialog.displayName = 'StartShoppingDialog';

export { StartShoppingDialog };
export type { TStartShoppingDialogProps };
