import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Group } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { logout } from '@/features/auth/actions';
import { useAuth, useIsAuthenticated } from '@/features/auth/hooks';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import { useChangePassword, useUpdateSettings } from '@/mutations/auth';
import { useSwitchHousehold } from '@/mutations/household';
import { useHouseholdOverview } from '@/queries/household';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import { vibrate } from '@/screens/shopping/helpers';
import { CircleUserRound, History, LogOut, Users } from 'lucide-react';
import { memo, useCallback, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { toast } from 'sonner';

type TChangePasswordForm = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const Profile = memo(() => {
  const { i18n, t } = useTranslation();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuth();
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const { mutateAsync: updateSettings, isPending: settingsPending } =
    useUpdateSettings();
  const { data: householdOverview } = useHouseholdOverview(isAuthenticated);
  const { mutateAsync: switchHousehold, isPending: switchingHousehold } =
    useSwitchHousehold();
  const { values, errors, setErrors, resetErrors, r, setValues } =
    useForm<TChangePasswordForm>({
      currentPassword: '',
      password: '',
      confirmPassword: ''
    });

  const onLogout = useCallback(() => {
    logout();
  }, []);
  const households = householdOverview?.households ?? [];
  const activeHouseholdId = householdOverview?.active?.id;
  const onSwitchHousehold = useCallback(
    async (householdId: string) => {
      if (householdId === activeHouseholdId) {
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
    [activeHouseholdId, switchHousehold, t]
  );

  const submit = useCallback(async () => {
    resetErrors();

    try {
      await changePassword(values);
      setValues({ currentPassword: '', password: '', confirmPassword: '' });
      toast.success(t('profile.passwordChanged'));
    } catch (error) {
      setErrors(parseTrpcErrors(error));
    }
  }, [changePassword, resetErrors, setErrors, setValues, t, values]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    },
    [submit]
  );

  const onDefaultShoppingModeChange = useCallback(
    async (value: string) => {
      try {
        await updateSettings({
          defaultShoppingMode: value as 'list' | 'swipe'
        });
        toast.success(t('profile.settingsUpdated'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('profile.failedToUpdateSettings')
        );
      }
    },
    [t, updateSettings]
  );

  const onLanguageChange = useCallback(
    (value: string) => {
      i18n.changeLanguage(value);
    },
    [i18n]
  );

  const updateSetting = useCallback(
    async (settings: Parameters<typeof updateSettings>[0]) => {
      try {
        await updateSettings(settings);
        toast.success(t('profile.settingsUpdated'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('profile.failedToUpdateSettings')
        );
      }
    },
    [t, updateSettings]
  );

  const testHaptics = useCallback(() => {
    const vibrated = vibrate([80, 50, 120]);

    if (vibrated) {
      toast.success(t('profile.hapticTestSent'));
      return;
    }

    toast.error(t('profile.hapticUnsupported'));
  }, [t]);

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Surface radius="xl" padding="lg">
          <Inline justify="between" className="gap-4">
            <Inline gap="sm" wrap={false} className="min-w-0">
              <Avatar className="size-14">
                <AvatarImage
                  src={auth.avatarUrl ?? undefined}
                  alt={t('profile.title')}
                />
                <AvatarFallback>
                  <CircleUserRound className="size-7" />
                </AvatarFallback>
              </Avatar>
              <Stack gap="none" className="min-w-0">
                <Text weight="semibold">{t('profile.title')}</Text>
                <Text size="sm" tone="muted" className="truncate">
                  {auth.email}
                </Text>
              </Stack>
            </Inline>
            <Button type="button" variant="outline" onClick={onLogout}>
              <LogOut className="size-4" />
              {t('profile.logout')}
            </Button>
          </Inline>
        </Surface>

        <Surface radius="xl" padding="lg">
          <Inline justify="between" wrap={false} className="gap-4">
            <Stack gap="xs" className="min-w-0">
              <Text weight="semibold">{t('profile.shoppingHistory')}</Text>
              <Text size="sm" tone="muted">
                {t('profile.shoppingHistoryDescription')}
              </Text>
            </Stack>
            <Button asChild variant="outline" className="shrink-0">
              <Link to="/shopping-history">
                <History className="size-4" />
                {t('common.open')}
              </Link>
            </Button>
          </Inline>
        </Surface>

        <Surface radius="xl" padding="lg">
          <Stack gap="md">
            <Inline justify="between" wrap={false} className="gap-4">
              <Stack gap="xs" className="min-w-0">
                <Text weight="semibold">{t('profile.household')}</Text>
                <Text size="sm" tone="muted">
                  {t('profile.householdDescription')}
                </Text>
              </Stack>
              <Button asChild variant="outline" className="shrink-0">
                <Link to="/household">
                  <Users className="size-4" />
                  {t('common.open')}
                </Link>
              </Button>
            </Inline>
            {households.length > 1 && (
              <Group label={t('profile.activeHousehold')}>
                <Select
                  value={activeHouseholdId}
                  onValueChange={onSwitchHousehold}
                  disabled={switchingHousehold}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {households.map((household) => (
                      <SelectItem key={household.id} value={household.id}>
                        {household.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Group>
            )}
          </Stack>
        </Surface>

        <Surface radius="xl" padding="lg">
          <Stack gap="lg">
            <Stack gap="xs">
              <Text weight="semibold">{t('profile.options')}</Text>
              <Text size="sm" tone="muted">
                {t('profile.optionsDescription')}
              </Text>
            </Stack>

            <Group label={t('profile.language')}>
              <Select
                value={i18n.resolvedLanguage?.startsWith('pt') ? 'pt' : 'en'}
                onValueChange={onLanguageChange}
              >
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue placeholder={t('profile.language')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    {t('profile.languageEnglish')}
                  </SelectItem>
                  <SelectItem value="pt">
                    {t('profile.languagePortuguese')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Group>

            <Group label={t('profile.defaultShoppingMode')}>
              <Select
                value={auth.settings?.defaultShoppingMode ?? 'list'}
                onValueChange={onDefaultShoppingModeChange}
                disabled={settingsPending}
              >
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue placeholder={t('profile.defaultShoppingMode')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">{t('profile.list')}</SelectItem>
                  <SelectItem value="swipe">{t('profile.swipe')}</SelectItem>
                </SelectContent>
              </Select>
            </Group>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-xl border border-border/70 bg-background/45 p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  {t('profile.compactAisleList')}
                </Text>
                <Text size="xs" tone="muted">
                  {t('profile.compactAisleDescription')}
                </Text>
              </Stack>
              <Switch
                checked={auth.settings?.compactShoppingList ?? true}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  updateSetting({ compactShoppingList: checked });
                }}
              />
            </Inline>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-xl border border-border/70 bg-background/45 p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  {t('profile.hapticFeedback')}
                </Text>
                <Text size="xs" tone="muted">
                  {t('profile.hapticDescription')}
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 w-fit rounded-full"
                  onClick={testHaptics}
                >
                  {t('profile.testHaptics')}
                </Button>
              </Stack>
              <Switch
                checked={auth.settings?.hapticsEnabled ?? true}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  updateSetting({ hapticsEnabled: checked });
                }}
              />
            </Inline>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-xl border border-border/70 bg-background/45 p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  {t('profile.actionSounds')}
                </Text>
                <Text size="xs" tone="muted">
                  {t('profile.actionSoundsDescription')}
                </Text>
              </Stack>
              <Switch
                checked={auth.settings?.soundEnabled ?? false}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  updateSetting({ soundEnabled: checked });
                }}
              />
            </Inline>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-xl border border-border/70 bg-background/45 p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  {t('profile.keepScreenAwake')}
                </Text>
                <Text size="xs" tone="muted">
                  {t('profile.keepScreenAwakeDescription')}
                </Text>
              </Stack>
              <Switch
                checked={auth.settings?.wakeLockEnabled ?? true}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  updateSetting({ wakeLockEnabled: checked });
                }}
              />
            </Inline>
          </Stack>
        </Surface>

        <Surface radius="xl" padding="lg">
          <form className="space-y-5" onSubmit={onSubmit}>
            <Stack gap="xs">
              <Text weight="semibold">{t('profile.changePassword')}</Text>
              <Text size="sm" tone="muted">
                {t('profile.changePasswordDescription')}
              </Text>
            </Stack>

            {errors._general && (
              <Text size="sm" tone="destructive" role="alert">
                {errors._general}
              </Text>
            )}

            <Group label={t('profile.currentPassword')}>
              <Input
                {...r('currentPassword', 'password')}
                autoComplete="current-password"
                disabled={isPending}
                placeholder={t('profile.currentPassword')}
              />
            </Group>

            <Group label={t('profile.newPassword')}>
              <Input
                {...r('password', 'password')}
                autoComplete="new-password"
                disabled={isPending}
                placeholder={t('profile.newPassword')}
              />
            </Group>

            <Group label={t('profile.confirmNewPassword')}>
              <Input
                {...r('confirmPassword', 'password')}
                autoComplete="new-password"
                disabled={isPending}
                placeholder={t('profile.confirmNewPassword')}
              />
            </Group>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t('profile.changing') : t('profile.changePassword')}
            </Button>
          </form>
        </Surface>
      </div>
    </main>
  );
});

Profile.displayName = 'Profile';

export { Profile };
