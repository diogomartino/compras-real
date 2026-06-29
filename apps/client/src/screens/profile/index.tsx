import { AppBottomNav } from '@/components/app-bottom-nav';
import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Group } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import { logout } from '@/features/auth/actions';
import { useAuth, useIsAuthenticated } from '@/features/auth/hooks';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import { useChangePassword } from '@/mutations/auth';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import { CircleUserRound, LogOut } from 'lucide-react';
import { memo, useCallback, type FormEvent } from 'react';
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
