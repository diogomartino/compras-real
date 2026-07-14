import { Inline, ListSkeleton, Stack, StatusChip, Surface, Text } from '@/components/ds';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import { cn } from '@/lib/utils';
import {
  useInviteMember,
  useLeaveHousehold,
  useRemoveMember,
  useSwitchHousehold
} from '@/mutations/household';
import { useHouseholdOverview } from '@/queries/household';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import {
  ArrowLeft,
  CircleUserRound,
  LogOut,
  UserMinus,
  UserPlus
} from 'lucide-react';
import { memo, useCallback, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

type TMember = {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'member';
  isSelf: boolean;
};

const roleLabelKey = (role: 'owner' | 'admin' | 'member') =>
  role === 'owner' ? 'household.roleOwner' : 'household.roleMember';

const Household = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { data, isLoading } = useHouseholdOverview(isAuthenticated);
  const { mutateAsync: switchHousehold, isPending: switching } =
    useSwitchHousehold();
  const { mutateAsync: inviteMember, isPending: inviting } = useInviteMember();
  const { mutateAsync: removeMember, isPending: removing } = useRemoveMember();
  const { mutateAsync: leaveHousehold, isPending: leaving } =
    useLeaveHousehold();
  const { values, r, setTrpcErrors, resetErrors, setValues } = useForm({
    email: ''
  });

  const households = data?.households ?? [];
  const active = data?.active ?? null;
  const isOwner = active?.myRole === 'owner';

  const onSwitch = useCallback(
    async (householdId: string) => {
      if (householdId === active?.id) {
        return;
      }

      try {
        await switchHousehold(householdId);
        toast.success(t('household.switched'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('household.failedToSwitch')
        );
      }
    },
    [active?.id, switchHousehold, t]
  );

  const onInvite = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetErrors();

      try {
        await inviteMember(values.email);
        setValues({ email: '' });
        toast.success(t('household.invited'));
      } catch (error) {
        setTrpcErrors(error);
      }
    },
    [inviteMember, resetErrors, setTrpcErrors, setValues, t, values.email]
  );

  const onKick = useCallback(
    async (member: TMember) => {
      const confirmed = await requestConfirmation({
        title: t('household.kickTitle'),
        message: t('household.kickMessage', { name: member.name }),
        confirmLabel: t('household.kick'),
        cancelLabel: t('common.cancel'),
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await removeMember(member.userId);
        toast.success(t('household.memberRemoved'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('household.failedToRemove')
        );
      }
    },
    [removeMember, t]
  );

  const onLeave = useCallback(async () => {
    const confirmed = await requestConfirmation({
      title: t('household.leaveTitle'),
      message: t('household.leaveMessage'),
      confirmLabel: t('household.leave'),
      cancelLabel: t('common.cancel'),
      variant: 'danger'
    });

    if (!confirmed) {
      return;
    }

    try {
      await leaveHousehold();
      toast.success(t('household.left'));
    } catch (error) {
      toast.error(
        parseTrpcErrors(error)._general ?? t('household.failedToLeave')
      );
    }
  }, [leaveHousehold, t]);

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Inline justify="between" wrap={false} className="gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="size-4" />
            {t('household.backToProfile')}
          </Button>
          <Text weight="semibold">{t('household.title')}</Text>
        </Inline>

        {isLoading && <ListSkeleton />}

        {households.length > 1 && (
          <Surface radius="xl" padding="lg">
            <Stack gap="md">
              <Text weight="semibold">{t('household.yourHouseholds')}</Text>
              <Stack gap="sm">
                {households.map((household) => (
                  <button
                    key={household.id}
                    type="button"
                    disabled={switching}
                    onClick={() => onSwitch(household.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors disabled:opacity-60',
                      household.isActive
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border/70 bg-card/75 active:bg-accent/40'
                    )}
                  >
                    <Stack gap="none" className="min-w-0">
                      <Text weight="semibold" className="truncate">
                        {household.name}
                      </Text>
                      <Text size="sm" tone="muted">
                        {t('household.memberCount', {
                          count: household.memberCount
                        })}
                      </Text>
                    </Stack>
                    <Inline gap="xs" wrap={false}>
                      <StatusChip
                        tone={household.role === 'owner' ? 'success' : 'muted'}
                      >
                        {t(roleLabelKey(household.role))}
                      </StatusChip>
                      {household.isActive && (
                        <StatusChip tone="info">
                          {t('household.active')}
                        </StatusChip>
                      )}
                    </Inline>
                  </button>
                ))}
              </Stack>
            </Stack>
          </Surface>
        )}

        {active && (
          <Surface radius="xl" padding="lg">
            <Stack gap="lg">
              <Stack gap="xs">
                <Text weight="semibold">{active.name}</Text>
                <Text size="sm" tone="muted">
                  {t('household.members')}
                </Text>
              </Stack>

              <Stack gap="sm">
                {active.members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/75 p-3"
                  >
                    <Avatar className="size-9 shrink-0">
                      <AvatarImage
                        src={member.avatarUrl ?? undefined}
                        alt={member.name}
                      />
                      <AvatarFallback>
                        <CircleUserRound className="size-5" />
                      </AvatarFallback>
                    </Avatar>
                    <Stack gap="none" className="min-w-0 flex-1">
                      <Text weight="semibold" className="truncate">
                        {member.isSelf
                          ? `${member.name} (${t('household.you')})`
                          : member.name}
                      </Text>
                      <Text size="sm" tone="muted" className="truncate">
                        {member.email}
                      </Text>
                    </Stack>
                    <Inline gap="xs" wrap={false}>
                      <StatusChip
                        tone={member.role === 'owner' ? 'success' : 'muted'}
                      >
                        {t(roleLabelKey(member.role))}
                      </StatusChip>
                      {isOwner && !member.isSelf && member.role !== 'owner' && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={removing}
                          aria-label={t('household.kick')}
                          onClick={() => onKick(member)}
                        >
                          <UserMinus className="size-4" />
                        </Button>
                      )}
                    </Inline>
                  </div>
                ))}
              </Stack>

              {isOwner ? (
                <form className="space-y-3" onSubmit={onInvite}>
                  <Stack gap="xs">
                    <Text weight="semibold">{t('household.invite')}</Text>
                    <Text size="sm" tone="muted">
                      {t('household.inviteDescription')}
                    </Text>
                  </Stack>
                  <Input
                    {...r('email', 'email')}
                    placeholder={t('household.invitePlaceholder')}
                    disabled={inviting}
                  />
                  <Inline justify="end">
                    <Button type="submit" disabled={inviting}>
                      <UserPlus className="size-4" />
                      {t('household.inviteButton')}
                    </Button>
                  </Inline>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={leaving}
                  onClick={onLeave}
                  className="text-destructive"
                >
                  <LogOut className="size-4" />
                  {t('household.leave')}
                </Button>
              )}
            </Stack>
          </Surface>
        )}
      </div>
    </main>
  );
});

Household.displayName = 'Household';

export { Household };
