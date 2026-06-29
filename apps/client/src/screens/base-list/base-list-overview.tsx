import { Inline, Stack, StatusChip, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { ListChecks, Pencil, Plus, Trash2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import type { TBaseListSummary } from './types';

type TBaseListCardProps = {
  baseList: TBaseListSummary;
  isMutating: boolean;
  onOpen: (baseList: TBaseListSummary) => void;
  onEdit: (baseList: TBaseListSummary) => void;
  onRemove: (baseList: TBaseListSummary) => void;
};

type TBaseListOverviewProps = {
  baseLists: TBaseListSummary[];
  isLoading: boolean;
  isMutating: boolean;
  errorMessage?: string;
  onCreate: () => void;
  onOpen: (baseList: TBaseListSummary) => void;
  onEdit: (baseList: TBaseListSummary) => void;
  onRemove: (baseList: TBaseListSummary) => void;
};

const BaseListCard = memo(
  ({ baseList, isMutating, onOpen, onEdit, onRemove }: TBaseListCardProps) => {
    const open = useCallback(() => {
      onOpen(baseList);
    }, [baseList, onOpen]);
    const edit = useCallback(() => {
      onEdit(baseList);
    }, [baseList, onEdit]);
    const remove = useCallback(() => {
      onRemove(baseList);
    }, [baseList, onRemove]);

    return (
      <Surface radius="2xl" padding="md">
        <Stack gap="md">
          <Inline justify="between" className="gap-3">
            <Stack gap="xs" className="min-w-0">
              <Inline gap="sm" wrap={false} className="min-w-0">
                <Text weight="semibold" className="truncate">
                  {baseList.name}
                </Text>
                <StatusChip tone={baseList.isEnabled ? 'success' : 'skipped'}>
                  {baseList.isEnabled ? 'Enabled' : 'Disabled'}
                </StatusChip>
              </Inline>
              <Text size="sm" tone="muted">
                {baseList.itemCount} products
              </Text>
            </Stack>
            <Button type="button" className="rounded-xl" onClick={open}>
              Open
            </Button>
          </Inline>

          <Inline gap="xs" justify="end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMutating}
              onClick={edit}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isMutating}
              onClick={remove}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </Inline>
        </Stack>
      </Surface>
    );
  }
);

BaseListCard.displayName = 'BaseListCard';

const BaseListOverview = memo(
  ({
    baseLists,
    isLoading,
    isMutating,
    errorMessage,
    onCreate,
    onOpen,
    onEdit,
    onRemove
  }: TBaseListOverviewProps) => {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Surface radius="2xl" padding="md">
          <Inline justify="between" className="gap-3">
            <Stack gap="xs">
              <Text weight="semibold">Base Lists</Text>
              <Text size="sm" tone="muted">
                Create reusable lists for different shopping needs.
              </Text>
            </Stack>
            <Button onClick={onCreate} className="rounded-xl">
              <Plus className="size-4" />
              Create Base List
            </Button>
          </Inline>
        </Surface>

        {errorMessage && (
          <Surface radius="2xl" padding="md" variant="muted">
            <Text tone="destructive">{errorMessage}</Text>
          </Surface>
        )}

        {isLoading && (
          <Surface radius="2xl" padding="lg">
            <Text tone="muted">Loading base lists...</Text>
          </Surface>
        )}

        {!isLoading && baseLists.length === 0 && (
          <Surface radius="2xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <ListChecks className="size-8 text-muted-foreground" />
              <Text weight="semibold">No base lists yet</Text>
              <Text size="sm" tone="muted">
                Create a Base List, then add catalog products to it.
              </Text>
            </Stack>
          </Surface>
        )}

        {!isLoading &&
          baseLists.map((baseList) => (
            <BaseListCard
              key={baseList.id}
              baseList={baseList}
              isMutating={isMutating}
              onOpen={onOpen}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
      </div>
    );
  }
);

BaseListOverview.displayName = 'BaseListOverview';

export { BaseListOverview };
