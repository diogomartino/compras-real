import { Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Group } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import { useResetPassword } from '@/mutations/auth';
import { memo, useCallback, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

type TResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = memo(() => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const { values, errors, setErrors, resetErrors, r } =
    useForm<TResetPasswordForm>({
      password: '',
      confirmPassword: ''
    });

  const submit = useCallback(async () => {
    resetErrors();

    try {
      await resetPassword({ token, ...values });
      toast.success('Password reset. You can now log in.');
      navigate('/', { replace: true });
    } catch (error) {
      setErrors(parseTrpcErrors(error));
    }
  }, [navigate, resetErrors, resetPassword, setErrors, token, values]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      void submit();
    },
    [submit]
  );

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 text-foreground">
      <Surface radius="2xl" padding="lg" className="w-full max-w-md">
        <form className="space-y-5" onSubmit={onSubmit}>
          <Stack gap="xs">
            <Text weight="semibold">Reset password</Text>
            <Text size="sm" tone="muted">
              Choose a new password for your account.
            </Text>
          </Stack>

          {!token && (
            <Text size="sm" tone="destructive" role="alert">
              This password reset link is missing a token.
            </Text>
          )}

          {errors._general && (
            <Text size="sm" tone="destructive" role="alert">
              {errors._general}
            </Text>
          )}

          <Group label="New password">
            <Input
              {...r('password', 'password')}
              autoComplete="new-password"
              disabled={isPending || !token}
              placeholder="New password"
            />
          </Group>

          <Group label="Confirm new password">
            <Input
              {...r('confirmPassword', 'password')}
              autoComplete="new-password"
              disabled={isPending || !token}
              placeholder="Repeat new password"
            />
          </Group>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !token}
          >
            {isPending ? 'Resetting...' : 'Reset password'}
          </Button>

          <Button asChild type="button" variant="ghost" className="w-full">
            <Link to="/">Back to login</Link>
          </Button>
        </form>
      </Surface>
    </main>
  );
});

ResetPassword.displayName = 'ResetPassword';

export { ResetPassword };
