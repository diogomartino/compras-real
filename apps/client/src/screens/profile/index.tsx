import { AppBottomNav } from '@/components/app-bottom-nav';
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
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import { vibrate } from '@/screens/shopping/helpers';
import { CircleUserRound, History, LogOut } from 'lucide-react';
import { memo, useCallback, type FormEvent } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

type TChangePasswordForm = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const Profile = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuth();
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const { mutateAsync: updateSettings, isPending: settingsPending } =
    useUpdateSettings();
  const { values, errors, setErrors, resetErrors, r, setValues } =
    useForm<TChangePasswordForm>({
      currentPassword: '',
      password: '',
      confirmPassword: ''
    });

  const onLogout = useCallback(() => {
    void logout();
  }, []);

  const submit = useCallback(async () => {
    resetErrors();

    try {
      await changePassword(values);
      setValues({ currentPassword: '', password: '', confirmPassword: '' });
      toast.success('Password changed.');
    } catch (error) {
      setErrors(parseTrpcErrors(error));
    }
  }, [changePassword, resetErrors, setErrors, setValues, values]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void submit();
    },
    [submit]
  );

  const onDefaultShoppingModeChange = useCallback(
    async (value: string) => {
      try {
        await updateSettings({
          defaultShoppingMode: value as 'list' | 'swipe'
        });
        toast.success('Settings updated.');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to update settings.'
        );
      }
    },
    [updateSettings]
  );

  const updateSetting = useCallback(
    async (settings: Parameters<typeof updateSettings>[0]) => {
      try {
        await updateSettings(settings);
        toast.success('Settings updated.');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to update settings.'
        );
      }
    },
    [updateSettings]
  );

  const testHaptics = useCallback(() => {
    const vibrated = vibrate([80, 50, 120]);

    if (vibrated) {
      toast.success('Haptic test sent.');
      return;
    }

    toast.error('This browser or device is not accepting vibration requests.');
  }, []);

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Surface radius="2xl" padding="lg">
          <Inline justify="between" className="gap-4">
            <Inline gap="sm" wrap={false} className="min-w-0">
              <Avatar className="size-14">
                <AvatarImage src={auth.avatarUrl ?? undefined} alt="Profile" />
                <AvatarFallback>
                  <CircleUserRound className="size-7" />
                </AvatarFallback>
              </Avatar>
              <Stack gap="none" className="min-w-0">
                <Text weight="semibold">Profile</Text>
                <Text size="sm" tone="muted" className="truncate">
                  {auth.email}
                </Text>
              </Stack>
            </Inline>
            <Button type="button" variant="outline" onClick={onLogout}>
              <LogOut className="size-4" />
              Log out
            </Button>
          </Inline>
        </Surface>

        <Surface radius="2xl" padding="lg">
          <Stack gap="lg">
            <Stack gap="xs">
              <Text weight="semibold">Options</Text>
              <Text size="sm" tone="muted">
                Configure how shopping mode opens for your account.
              </Text>
            </Stack>

            <Group label="Default shopping mode">
              <Select
                value={auth.settings?.defaultShoppingMode ?? 'list'}
                onValueChange={onDefaultShoppingModeChange}
                disabled={settingsPending}
              >
                <SelectTrigger className="h-11 w-full rounded-xl">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="swipe">Swipe</SelectItem>
                </SelectContent>
              </Select>
            </Group>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-2xl border border-border p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  Compact aisle list
                </Text>
                <Text size="xs" tone="muted">
                  Use dense rows with sticky category headers while shopping.
                </Text>
              </Stack>
              <Switch
                checked={auth.settings?.compactShoppingList ?? true}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  void updateSetting({ compactShoppingList: checked });
                }}
              />
            </Inline>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-2xl border border-border p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  Haptic feedback
                </Text>
                <Text size="xs" tone="muted">
                  Vibrate briefly when checking or skipping products.
                </Text>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1 w-fit rounded-full"
                  onClick={testHaptics}
                >
                  Test haptics
                </Button>
              </Stack>
              <Switch
                checked={auth.settings?.hapticsEnabled ?? true}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  void updateSetting({ hapticsEnabled: checked });
                }}
              />
            </Inline>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-2xl border border-border p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  Action sounds
                </Text>
                <Text size="xs" tone="muted">
                  Play a soft tone for shopping actions.
                </Text>
              </Stack>
              <Switch
                checked={auth.settings?.soundEnabled ?? false}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  void updateSetting({ soundEnabled: checked });
                }}
              />
            </Inline>

            <Inline
              justify="between"
              wrap={false}
              className="gap-4 rounded-2xl border border-border p-3"
            >
              <Stack gap="xs" className="min-w-0">
                <Text size="sm" weight="semibold">
                  Keep screen awake
                </Text>
                <Text size="xs" tone="muted">
                  Prevent the screen from sleeping during shopping mode.
                </Text>
              </Stack>
              <Switch
                checked={auth.settings?.wakeLockEnabled ?? true}
                disabled={settingsPending}
                onCheckedChange={(checked) => {
                  void updateSetting({ wakeLockEnabled: checked });
                }}
              />
            </Inline>
          </Stack>
        </Surface>

        <Surface radius="2xl" padding="lg">
          <Inline justify="between" wrap={false} className="gap-4">
            <Stack gap="xs" className="min-w-0">
              <Text weight="semibold">Shopping history</Text>
              <Text size="sm" tone="muted">
                See finished lists and what was bought or discarded.
              </Text>
            </Stack>
            <Button asChild variant="outline" className="shrink-0 rounded-xl">
              <Link to="/shopping-history">
                <History className="size-4" />
                Open
              </Link>
            </Button>
          </Inline>
        </Surface>

        <Surface radius="2xl" padding="lg">
          <form className="space-y-5" onSubmit={onSubmit}>
            <Stack gap="xs">
              <Text weight="semibold">Change password</Text>
              <Text size="sm" tone="muted">
                Update the password used for email login.
              </Text>
            </Stack>

            {errors._general && (
              <Text size="sm" tone="destructive" role="alert">
                {errors._general}
              </Text>
            )}

            <Group label="Current password">
              <Input
                {...r('currentPassword', 'password')}
                autoComplete="current-password"
                disabled={isPending}
                placeholder="Current password"
              />
            </Group>

            <Group label="New password">
              <Input
                {...r('password', 'password')}
                autoComplete="new-password"
                disabled={isPending}
                placeholder="New password"
              />
            </Group>

            <Group label="Confirm new password">
              <Input
                {...r('confirmPassword', 'password')}
                autoComplete="new-password"
                disabled={isPending}
                placeholder="Repeat new password"
              />
            </Group>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Changing...' : 'Change password'}
            </Button>
          </form>
        </Surface>
      </div>

      <AppBottomNav />
    </main>
  );
});

Profile.displayName = 'Profile';

export { Profile };
