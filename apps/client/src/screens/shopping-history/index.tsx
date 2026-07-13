import { AppBottomNav } from '@/components/app-bottom-nav';
import {
  Inline,
  Media,
  Stack,
  StatusChip,
  Surface,
  Text
} from '@/components/ds';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { useShoppingHistory } from '@/queries/shopping';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import { formatQuantity } from '@/screens/shopping/helpers';
import type { TOngoingListEntry } from '@myapp/shared';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  History,
  ShoppingBag,
  X
} from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const formatDateTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const getCounts = (items: TOngoingListEntry[]) => ({
  checked: items.filter((item) => item.status === 'checked').length,
  discarded: items.filter((item) => item.status === 'discarded').length,
  ignored: items.filter((item) => item.status === 'ignored').length,
  pending: items.filter((item) => item.status === 'pending').length
});

const getStatusTone = (status: TOngoingListEntry['status']) => {
  if (status === 'checked') {
    return 'success';
  }

  if (status === 'discarded' || status === 'ignored') {
    return 'skipped';
  }

  return 'muted';
};

const ShoppingHistory = memo(() => {
  const { t } = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { historyId } = useParams();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useShoppingHistory(isAuthenticated);
  const history = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );
  const selectedHistory = useMemo(
    () => history.find((list) => list.id === historyId),
    [history, historyId]
  );
  const loadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  const renderHeader = (title: string) => (
    <Inline justify="between" wrap={false} className="gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={() => navigate(historyId ? '/shopping-history' : '/profile')}
      >
        <ArrowLeft className="size-4" />
        {historyId ? t('common.back') : t('shoppingHistory.profile')}
      </Button>
      <Text weight="semibold">{title}</Text>
    </Inline>
  );

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {renderHeader(
          historyId
            ? t('shoppingHistory.detailsTitle')
            : t('shoppingHistory.title')
        )}

        {error && (
          <Surface radius="xl" padding="md" variant="muted">
            <Text tone="destructive">{error.message}</Text>
          </Surface>
        )}

        {isLoading && (
          <Surface radius="xl" padding="lg">
            <Text tone="muted">{t('shoppingHistory.loading')}</Text>
          </Surface>
        )}

        {!isLoading && !historyId && history.length === 0 && (
          <Surface radius="xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <ShoppingBag className="size-8 text-muted-foreground" />
              <Text weight="semibold">{t('shoppingHistory.emptyTitle')}</Text>
              <Text size="sm" tone="muted">
                {t('shoppingHistory.emptyDescription')}
              </Text>
            </Stack>
          </Surface>
        )}

        {!isLoading && !historyId && history.length > 0 && (
          <>
            <Surface radius="xl" padding="lg">
              <Inline gap="sm" wrap={false}>
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <History className="size-5" />
                </div>
                <Stack gap="none" className="min-w-0">
                  <Text weight="semibold">
                    {t('shoppingHistory.finishedShops')}
                  </Text>
                  <Text size="sm" tone="muted">
                    {t('shoppingHistory.description')}
                  </Text>
                </Stack>
              </Inline>
            </Surface>

            <Stack gap="sm">
              {history.map((list) => {
                const counts = getCounts(list.items);
                const startedBy =
                  list.shoppingStartedByUser?.name ??
                  t('shoppingHistory.unknownUser');

                return (
                  <Link
                    key={list.id}
                    to={`/shopping-history/${list.id}`}
                    className="rounded-xl border border-border/70 bg-card/75 p-4 transition-colors active:bg-accent/35"
                  >
                    <Inline justify="between" wrap={false} className="gap-3">
                      <Stack gap="xs" className="min-w-0">
                        <Text weight="semibold">
                          {formatDate(list.shoppingStartedAt ?? list.updatedAt)}
                        </Text>
                        <Inline gap="xs" wrap={false} className="min-w-0">
                          <Avatar className="size-5">
                            <AvatarImage
                              src={
                                list.shoppingStartedByUser?.avatarUrl ??
                                undefined
                              }
                              alt={startedBy}
                            />
                            <AvatarFallback>
                              <CircleUserRound className="size-3" />
                            </AvatarFallback>
                          </Avatar>
                          <Text size="sm" tone="muted" className="truncate">
                            {t('shoppingHistory.startedBy', {
                              name: startedBy,
                              count: list.items.length
                            })}
                          </Text>
                        </Inline>
                        <Inline gap="xs">
                          <StatusChip tone="success">
                            <CheckCircle2 className="size-3" />
                            {counts.checked}
                          </StatusChip>
                          <StatusChip tone="skipped">
                            <X className="size-3" />
                            {counts.discarded + counts.ignored}
                          </StatusChip>
                        </Inline>
                      </Stack>
                      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
                    </Inline>
                  </Link>
                );
              })}
              <InfiniteScroll
                hasMore={!!hasNextPage}
                isLoading={isFetchingNextPage}
                loadingLabel={t('shoppingHistory.loadingMore')}
                endLabel={t('shoppingHistory.end')}
                onLoadMore={loadMore}
              />
            </Stack>
          </>
        )}

        {!isLoading && historyId && !selectedHistory && (
          <Surface radius="xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <ShoppingBag className="size-8 text-muted-foreground" />
              <Text weight="semibold">
                {t('shoppingHistory.notFoundTitle')}
              </Text>
              <Text size="sm" tone="muted">
                {t('shoppingHistory.notFoundDescription')}
              </Text>
              <Button asChild>
                <Link to="/shopping-history">
                  {t('shoppingHistory.backToHistory')}
                </Link>
              </Button>
            </Stack>
          </Surface>
        )}

        {!isLoading && selectedHistory && (
          <Stack gap="md">
            {(() => {
              const counts = getCounts(selectedHistory.items);
              const startedBy =
                selectedHistory.shoppingStartedByUser?.name ??
                t('shoppingHistory.unknownUser');

              return (
                <Surface radius="xl" padding="lg">
                  <Stack gap="md">
                    <Stack gap="xs">
                      <Text weight="semibold">
                        {formatDateTime(
                          selectedHistory.shoppingStartedAt ??
                            selectedHistory.updatedAt
                        )}
                      </Text>
                      <Text size="sm" tone="muted">
                        {t('shoppingHistory.startedBy', {
                          name: startedBy,
                          count: selectedHistory.items.length
                        })}
                      </Text>
                    </Stack>
                    <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-border/70 bg-background/45 text-center">
                      <div className="border-r border-border/70 p-3">
                        <Text weight="semibold">
                          {selectedHistory.items.length}
                        </Text>
                        <Text size="xs" tone="muted">
                          {t('shoppingHistory.total')}
                        </Text>
                      </div>
                      <div className="border-r border-border/70 p-3">
                        <Text weight="semibold">{counts.checked}</Text>
                        <Text size="xs" tone="muted">
                          {t('shoppingHistory.checked')}
                        </Text>
                      </div>
                      <div className="border-r border-border/70 p-3">
                        <Text weight="semibold">{counts.discarded}</Text>
                        <Text size="xs" tone="muted">
                          {t('shoppingHistory.discarded')}
                        </Text>
                      </div>
                      <div className="p-3">
                        <Text weight="semibold">
                          {counts.ignored + counts.pending}
                        </Text>
                        <Text size="xs" tone="muted">
                          {t('shoppingHistory.left')}
                        </Text>
                      </div>
                    </div>
                  </Stack>
                </Surface>
              );
            })()}

            <Stack gap="sm">
              {selectedHistory.items.map((item) => (
                <div
                  key={item.id}
                  className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-xl border border-border/70 bg-card/75 p-3"
                >
                  <Media src={item.imageUrl} alt={item.title} size="md" />
                  <Stack gap="xs" className="min-w-0">
                    <Inline justify="between" wrap={false} className="gap-3">
                      <Text weight="semibold" className="truncate">
                        {item.title}
                      </Text>
                      <StatusChip tone={getStatusTone(item.status)}>
                        {t(`shoppingHistory.status.${item.status}`)}
                      </StatusChip>
                    </Inline>
                    <Text size="sm" tone="muted" className="truncate">
                      {item.categoryName ?? t('common.uncategorized')} ·{' '}
                      {formatQuantity(item.quantityAmount, item.quantityUnit)}
                    </Text>
                    {item.statusUpdatedAt && (
                      <Text size="xs" tone="subtle">
                        {t('shoppingHistory.updatedAt', {
                          date: formatDateTime(item.statusUpdatedAt)
                        })}
                      </Text>
                    )}
                  </Stack>
                </div>
              ))}
            </Stack>
          </Stack>
        )}
      </div>
      <AppBottomNav />
    </main>
  );
});

ShoppingHistory.displayName = 'ShoppingHistory';

export { ShoppingHistory };
