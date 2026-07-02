import { AppBottomNav } from '@/components/app-bottom-nav';
import { Inline, Stack, StatusChip, Surface, Text } from '@/components/ds';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { useShoppingHistory } from '@/queries/shopping';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import {
  ArrowLeft,
  CheckCircle2,
  CircleUserRound,
  History,
  ShoppingBag,
  X
} from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

const ShoppingHistory = memo(() => {
  const { t } = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const { data, isLoading, error } = useShoppingHistory(isAuthenticated);
  const history = useMemo(() => data ?? [], [data]);

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Inline justify="between" wrap={false} className="gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="size-4" />
            {t('shoppingHistory.profile')}
          </Button>
          <Text weight="semibold">{t('shoppingHistory.title')}</Text>
        </Inline>

        <Surface radius="2xl" padding="lg">
          <Inline gap="sm" wrap={false}>
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <History className="size-5" />
            </div>
            <Stack gap="none" className="min-w-0">
              <Text weight="semibold">{t('shoppingHistory.finishedShops')}</Text>
              <Text size="sm" tone="muted">
                {t('shoppingHistory.description')}
              </Text>
            </Stack>
          </Inline>
        </Surface>

        {error && (
          <Surface radius="2xl" padding="md" variant="muted">
            <Text tone="destructive">{error.message}</Text>
          </Surface>
        )}

        {isLoading && (
          <Surface radius="2xl" padding="lg">
            <Text tone="muted">{t('shoppingHistory.loading')}</Text>
          </Surface>
        )}

        {!isLoading && history.length === 0 && (
          <Surface radius="2xl" padding="lg" className="text-center">
            <Stack gap="sm" align="center">
              <ShoppingBag className="size-8 text-muted-foreground" />
              <Text weight="semibold">{t('shoppingHistory.emptyTitle')}</Text>
              <Text size="sm" tone="muted">
                {t('shoppingHistory.emptyDescription')}
              </Text>
            </Stack>
          </Surface>
        )}

        <Stack gap="lg">
          {history.map((list) => {
            const checkedCount = list.items.filter(
              (item) => item.status === 'checked'
            ).length;
            const discardedCount = list.items.filter(
              (item) => item.status === 'discarded'
            ).length;

            return (
              <Surface key={list.id} radius="2xl" padding="md">
                <Stack gap="md">
                  <Inline justify="between" wrap={false} className="gap-3">
                    <Stack gap="none" className="min-w-0">
                      <Text weight="semibold">
                        {formatDate(list.shoppingStartedAt ?? list.updatedAt)}
                      </Text>
                      <Inline gap="xs" wrap={false} className="min-w-0">
                        <Avatar className="size-5">
                          <AvatarImage
                            src={
                              list.shoppingStartedByUser?.avatarUrl ?? undefined
                            }
                            alt={
                              list.shoppingStartedByUser?.name ?? 'Unknown user'
                            }
                          />
                          <AvatarFallback>
                            <CircleUserRound className="size-3" />
                          </AvatarFallback>
                        </Avatar>
                        <Text size="sm" tone="muted" className="truncate">
                          {t('shoppingHistory.startedBy', {
                            name:
                              list.shoppingStartedByUser?.name ?? 'Unknown user',
                            count: list.items.length
                          })}
                        </Text>
                      </Inline>
                    </Stack>
                    <Inline gap="xs" wrap={false}>
                      <StatusChip tone="success">
                        <CheckCircle2 className="size-3" />
                        {checkedCount}
                      </StatusChip>
                      <StatusChip tone="skipped">
                        <X className="size-3" />
                        {discardedCount}
                      </StatusChip>
                    </Inline>
                  </Inline>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {list.items.map((item) => (
                      <Inline
                        key={item.id}
                        justify="between"
                        wrap={false}
                        className="gap-2 rounded-xl bg-muted/50 px-3 py-2"
                      >
                        <Text size="sm" className="truncate">
                          {item.title}
                        </Text>
                        <StatusChip
                          tone={
                            item.status === 'checked'
                              ? 'success'
                              : item.status === 'discarded'
                                ? 'skipped'
                                : 'muted'
                          }
                        >
                          {item.status}
                        </StatusChip>
                      </Inline>
                    ))}
                  </div>
                </Stack>
              </Surface>
            );
          })}
        </Stack>
      </div>
      <AppBottomNav />
    </main>
  );
});

ShoppingHistory.displayName = 'ShoppingHistory';

export { ShoppingHistory };
