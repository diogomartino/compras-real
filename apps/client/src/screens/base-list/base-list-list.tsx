import { Inline, Stack, StatusChip, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ListChecks, Plus, Search } from 'lucide-react';
import { memo, type ChangeEvent } from 'react';
import { BaseListItemRow } from './base-list-item-row';
import type { TBaseListDetails, TBaseListEntry } from './types';

type TBaseListGroup = {
  categoryName: string;
  items: TBaseListEntry[];
};

type TBaseListListProps = {
  baseList: TBaseListDetails;
  groups: TBaseListGroup[];
  query: string;
  isLoading: boolean;
  isMutating: boolean;
  errorMessage?: string;
  onBack: () => void;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  onEdit: (item: TBaseListEntry) => void;
  onRemove: (item: TBaseListEntry) => void;
};

const BaseListList = memo(
  ({
    baseList,
    groups,
    query,
    isLoading,
    isMutating,
    errorMessage,
    onBack,
    onQueryChange,
    onCreate,
    onEdit,
    onRemove
  }: TBaseListListProps) => {
    const itemCount = groups.reduce(
      (total, group) => total + group.items.length,
      0
    );

    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Surface radius="2xl" padding="md">
          <Stack gap="md">
            <Inline justify="between" className="gap-3">
              <Inline gap="sm" wrap={false} className="min-w-0">
                <Button type="button" variant="ghost" onClick={onBack}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
                <Stack gap="xs" className="min-w-0">
                  <Inline gap="sm" wrap={false} className="min-w-0">
                    <Text weight="semibold" className="truncate">
                      {baseList.name}
                    </Text>
                    <StatusChip
                      tone={baseList.isEnabled ? 'success' : 'skipped'}
                    >
                      {baseList.isEnabled ? 'Enabled' : 'Disabled'}
                    </StatusChip>
                  </Inline>
                  <Text size="sm" tone="muted">
                    Products in this base list.
                  </Text>
                </Stack>
              </Inline>
              <Button onClick={onCreate} className="rounded-xl">
                <Plus className="size-4" />
                Add product
              </Button>
            </Inline>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={onQueryChange}
                className="h-11 rounded-xl pl-9"
                placeholder="Search products in this base list"
              />
            </div>
          </Stack>
        </Surface>

        {errorMessage && (
          <Surface radius="2xl" padding="md" variant="muted">
            <Text tone="destructive">{errorMessage}</Text>
          </Surface>
        )}

        {isLoading && (
          <Surface radius="2xl" padding="lg">
            <Text tone="muted">Loading base list...</Text>
          </Surface>
        )}

        {!isLoading && itemCount === 0 && (
          <Surface radius="2xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <ListChecks className="size-8 text-muted-foreground" />
              <Text weight="semibold">No products found</Text>
              <Text size="sm" tone="muted">
                Add catalog products to this Base List.
              </Text>
            </Stack>
          </Surface>
        )}

        {!isLoading &&
          groups.map((group) => (
            <Stack key={group.categoryName} gap="sm">
              <Inline justify="between" className="px-1">
                <Text weight="semibold">{group.categoryName}</Text>
                <Text size="sm" tone="muted">
                  {group.items.length} items
                </Text>
              </Inline>
              {group.items.map((item) => (
                <BaseListItemRow
                  key={item.id}
                  item={item}
                  isMutating={isMutating}
                  onEdit={onEdit}
                  onRemove={onRemove}
                />
              ))}
            </Stack>
          ))}
      </div>
    );
  }
);

BaseListList.displayName = 'BaseListList';

export { BaseListList };
export type { TBaseListGroup };
