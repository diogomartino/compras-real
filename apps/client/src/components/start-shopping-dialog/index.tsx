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
import {
  AlertTriangle,
  ImageOff,
  Layers3,
  ListChecks,
  ShoppingCart
} from 'lucide-react';
import { memo, useMemo } from 'react';

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
    const auth = useAuth();
    const items = useMemo(() => ongoingList?.items ?? [], [ongoingList]);
    const categoryGroups = useMemo(() => {
      const groups = new Map<string, number>();

      items.forEach((item) => {
        const categoryName = item.categoryName ?? 'Uncategorized';

        groups.set(categoryName, (groups.get(categoryName) ?? 0) + 1);
      });

      return Array.from(groups.entries())
        .map(([categoryName, count]) => ({ categoryName, count }))
        .sort((firstGroup, secondGroup) => {
          if (firstGroup.categoryName === 'Uncategorized') {
            return 1;
          }

          if (secondGroup.categoryName === 'Uncategorized') {
            return -1;
          }

          return firstGroup.categoryName.localeCompare(
            secondGroup.categoryName
          );
        });
    }, [items]);
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
            <DialogTitle>Ready to shop?</DialogTitle>
            <DialogDescription>
              Preview the ongoing list before your household enters shopping
              mode.
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <Surface radius="2xl" padding="lg" variant="muted">
              <Text tone="muted">Loading current list...</Text>
            </Surface>
          )}

          {!isLoading && !hasItems && (
            <Surface radius="2xl" padding="lg" className="text-center">
              <Stack gap="md" align="center">
                <ShoppingCart className="size-10 text-muted-foreground" />
                <Stack gap="xs" align="center">
                  <Text weight="semibold">Your ongoing list is empty</Text>
                  <Text size="sm" tone="muted">
                    Add products before starting shopping mode.
                  </Text>
                </Stack>
                <Button
                  type="button"
                  className="rounded-xl"
                  onClick={onAddProducts}
                >
                  Add products
                </Button>
              </Stack>
            </Surface>
          )}

          {!isLoading && hasItems && (
            <Stack gap="md">
              <div className="grid grid-cols-3 gap-2">
                <Surface radius="2xl" padding="md" variant="muted">
                  <Stack gap="xs">
                    <ShoppingCart className="size-5 text-primary" />
                    <Text weight="semibold">{items.length}</Text>
                    <Text size="xs" tone="muted">
                      Products
                    </Text>
                  </Stack>
                </Surface>
                <Surface radius="2xl" padding="md" variant="muted">
                  <Stack gap="xs">
                    <Layers3 className="size-5 text-primary" />
                    <Text weight="semibold">{categoryGroups.length}</Text>
                    <Text size="xs" tone="muted">
                      Categories
                    </Text>
                  </Stack>
                </Surface>
                <Surface radius="2xl" padding="md" variant="muted">
                  <Stack gap="xs">
                    <ListChecks className="size-5 text-primary" />
                    <Text weight="semibold" className="capitalize">
                      {defaultMode}
                    </Text>
                    <Text size="xs" tone="muted">
                      Default mode
                    </Text>
                  </Stack>
                </Surface>
              </div>

              {(uncategorizedCount > 0 || missingImageCount > 0) && (
                <Stack gap="sm">
                  {uncategorizedCount > 0 && (
                    <Inline
                      gap="sm"
                      wrap={false}
                      className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-orange-900"
                    >
                      <AlertTriangle className="size-4 shrink-0" />
                      <Text size="sm">
                        {uncategorizedCount} products are uncategorized.
                      </Text>
                    </Inline>
                  )}
                  {missingImageCount > 0 && (
                    <Inline
                      gap="sm"
                      wrap={false}
                      className="rounded-2xl border border-muted bg-muted/60 px-3 py-2"
                    >
                      <ImageOff className="size-4 shrink-0 text-muted-foreground" />
                      <Text size="sm">
                        {missingImageCount} products have no image for swipe
                        mode.
                      </Text>
                    </Inline>
                  )}
                </Stack>
              )}

              <Stack gap="sm">
                <Text size="sm" weight="semibold">
                  Categories
                </Text>
                <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-border p-3">
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
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {hasItems && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={onReviewList}
              >
                Review list
              </Button>
            )}
            {hasItems && (
              <Button
                type="button"
                className="rounded-xl"
                disabled={isPending}
                onClick={onStartShopping}
              >
                {isPending ? 'Starting...' : 'Start shopping'}
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
