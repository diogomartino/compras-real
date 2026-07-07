import { Inline, Stack, Text } from '@/components/ds';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type {
  TShoppingActivity,
  TShoppingPresenceUser
} from '@/queries/shopping';
import { CircleUserRound } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type TShoppingLiveStatusProps = {
  users: TShoppingPresenceUser[];
  activities: TShoppingActivity[];
  currentUserId: string | undefined;
  variant?: 'default' | 'overlay';
};

const ShoppingLiveStatus = memo(
  ({
    users,
    activities,
    currentUserId,
    variant = 'default'
  }: TShoppingLiveStatusProps) => {
    const { t } = useTranslation();
    const otherActivities = useMemo(
      () => activities.filter((activity) => activity.actor.id !== currentUserId),
      [activities, currentUserId]
    );
    const latestActivity = otherActivities[0];
    const presenceLabel = useMemo(() => {
      if (users.length === 0) {
        return t('shopping.presenceActive');
      }

      if (users.length === 1) {
        return t('shopping.presenceOne', { name: users[0]?.name ?? 'Someone' });
      }

      return t('shopping.presenceMany', { count: users.length });
    }, [t, users]);

    if (users.length === 0 && !latestActivity) {
      return null;
    }

    return (
      <div
        className={cn(
          'rounded-xl border px-3 py-2',
          variant === 'overlay'
            ? 'pointer-events-none border-white/15 bg-black/45 text-white shadow-black/20'
            : 'border-border bg-muted/55 text-foreground'
        )}
      >
        <Inline justify="between" wrap={false} className="gap-3">
          <Inline gap="xs" wrap={false} className="min-w-0">
            <div className="flex -space-x-2">
              {users.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className={cn(
                    'size-6 border-2',
                    variant === 'overlay' ? 'border-white/30' : 'border-background'
                  )}
                >
                  <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                  <AvatarFallback>
                    <CircleUserRound className="size-3" />
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Stack gap="none" className="min-w-0">
              <Text
                size="sm"
                weight="semibold"
                className={cn('truncate', variant === 'overlay' && 'text-white')}
              >
                {presenceLabel}
              </Text>
              {latestActivity && (
                <Text
                  size="xs"
                  className={cn(
                    'truncate text-muted-foreground',
                    variant === 'overlay' && 'text-white/75'
                  )}
                >
                  {t('shopping.activity', {
                    name: latestActivity.actor.name,
                    status: latestActivity.status,
                    product: latestActivity.product.title
                  })}
                </Text>
              )}
            </Stack>
          </Inline>
        </Inline>
      </div>
    );
  }
);

ShoppingLiveStatus.displayName = 'ShoppingLiveStatus';

export { ShoppingLiveStatus };
export type { TShoppingLiveStatusProps };
