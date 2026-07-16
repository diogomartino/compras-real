import {
  Inline,
  ListSkeleton,
  Stack,
  StatusChip,
  Surface,
  Text
} from '@/components/ds';
import { KebabMenu, type TKebabMenuItem } from '@/components/kebab-menu';
import { CardContextMenu } from '@/components/kebab-menu/card-context-menu';
import { Button } from '@/components/ui/button';
import {
  ListChecks,
  ListPlus,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Trash2
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TBaseListSummary } from './types';

type TBaseListCardProps = {
  baseList: TBaseListSummary;
  isMutating: boolean;
  onOpen: (baseList: TBaseListSummary) => void;
  onEdit: (baseList: TBaseListSummary) => void;
  onRemove: (baseList: TBaseListSummary) => void;
  onAddAll: (baseList: TBaseListSummary) => void;
  onToggleEnabled: (baseList: TBaseListSummary) => void;
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
  onAddAll: (baseList: TBaseListSummary) => void;
  onToggleEnabled: (baseList: TBaseListSummary) => void;
};

const BaseListCard = memo(
  ({
    baseList,
    isMutating,
    onOpen,
    onEdit,
    onRemove,
    onAddAll,
    onToggleEnabled
  }: TBaseListCardProps) => {
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
    const addAll = useCallback(() => {
      onAddAll(baseList);
    }, [baseList, onAddAll]);
    const toggleEnabled = useCallback(() => {
      onToggleEnabled(baseList);
    }, [baseList, onToggleEnabled]);

    const menuItems = useMemo<TKebabMenuItem[]>(
      () => [
        {
          key: 'add-all',
          icon: <ListPlus className="size-4" />,
          label: t('baseList.addAllToList'),
          onSelect: addAll
        },
        {
          key: 'toggle-enabled',
          icon: baseList.isEnabled ? (
            <PowerOff className="size-4" />
          ) : (
            <Power className="size-4" />
          ),
          label: baseList.isEnabled
            ? t('baseList.disable')
            : t('baseList.enable'),
          onSelect: toggleEnabled
        },
        {
          key: 'edit',
          icon: <Pencil className="size-4" />,
          label: t('baseList.editBaseList'),
          onSelect: edit
        },
        {
          key: 'delete',
          icon: <Trash2 className="size-4" />,
          label: t('baseList.deleteBaseList'),
          onSelect: remove,
          variant: 'destructive'
        }
      ],
      [addAll, baseList.isEnabled, edit, remove, t, toggleEnabled]
    );

    return (
      <CardContextMenu items={menuItems} contentClassName="w-56">
        <Surface radius="xl" padding="md">
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
              <Button type="button" onClick={open}>
                {t('baseList.open')}
              </Button>
              <KebabMenu
                label={t('baseList.baseListActions')}
                disabled={isMutating}
                contentClassName="w-56"
                items={menuItems}
              />
            </Inline>
          </Inline>
        </Surface>
      </CardContextMenu>
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
    onRemove,
    onAddAll,
    onToggleEnabled
  }: TBaseListOverviewProps) => {
    const { t } = useTranslation();

    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Surface radius="xl" padding="md" className="bg-card/85">
          <Inline justify="between" className="gap-3">
            <Stack gap="xs">
              <Text weight="semibold">{t('baseList.title')}</Text>
              <Text size="sm" tone="muted">
                {t('baseList.description')}
              </Text>
            </Stack>
            <Button onClick={onCreate}>
              <Plus className="size-4" />
              {t('baseList.createBaseList')}
            </Button>
          </Inline>
        </Surface>

        {errorMessage && (
          <Surface radius="xl" padding="md" variant="muted">
            <Text tone="destructive">{errorMessage}</Text>
          </Surface>
        )}

        {isLoading && <ListSkeleton />}

        {!isLoading && baseLists.length === 0 && (
          <Surface radius="xl" padding="lg" className="text-center">
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
              onAddAll={onAddAll}
              onToggleEnabled={onToggleEnabled}
            />
          ))}
      </div>
    );
  }
);

BaseListOverview.displayName = 'BaseListOverview';

export { BaseListOverview };
