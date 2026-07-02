import { Inline, Stack, StatusChip, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ListChecks, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
        <Inline justify="between" className="gap-3" wrap={false}>
          <Stack gap="xs" className="min-w-0">
            <Inline gap="sm" wrap={false} className="min-w-0">
              <Text weight="semibold" className="truncate">
                {baseList.name}
              </Text>
              <StatusChip tone={baseList.isEnabled ? 'success' : 'skipped'}>
                {baseList.isEnabled
                  ? t('baseList.enabled')
                  : t('baseList.disabled')}
              </StatusChip>
            </Inline>
            <Text size="sm" tone="muted">
              {t('baseList.productCount', { count: baseList.itemCount })}
            </Text>
          </Stack>

          <Inline gap="xs" wrap={false}>
            <Button type="button" className="rounded-xl" onClick={open}>
              {t('baseList.open')}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  disabled={isMutating}
                  aria-label={t('baseList.baseListActions')}
                >
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuItem onSelect={edit}>
                  <Pencil className="size-4" />
                  {t('baseList.editBaseList')}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onSelect={remove}>
                  <Trash2 className="size-4" />
                  {t('baseList.deleteBaseList')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Inline>
        </Inline>
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
    const { t } = useTranslation();

    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Surface radius="2xl" padding="md">
          <Inline justify="between" className="gap-3">
            <Stack gap="xs">
              <Text weight="semibold">{t('baseList.title')}</Text>
              <Text size="sm" tone="muted">
                {t('baseList.description')}
              </Text>
            </Stack>
            <Button onClick={onCreate} className="rounded-xl">
              <Plus className="size-4" />
              {t('baseList.createBaseList')}
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
            <Text tone="muted">{t('baseList.loadingLists')}</Text>
          </Surface>
        )}

        {!isLoading && baseLists.length === 0 && (
          <Surface radius="2xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <ListChecks className="size-8 text-muted-foreground" />
              <Text weight="semibold">{t('baseList.noListsYet')}</Text>
              <Text size="sm" tone="muted">
                {t('baseList.noListsDescription')}
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
