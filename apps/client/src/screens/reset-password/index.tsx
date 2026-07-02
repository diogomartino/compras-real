import { Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Group } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import { useResetPassword } from '@/mutations/auth';
import { memo, useCallback, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

type TResetPasswordForm = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = memo(() => {
  const { t } = useTranslation();
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
      toast.success(t('resetPassword.success'));
      navigate('/', { replace: true });
    } catch (error) {
      setErrors(parseTrpcErrors(error));
    }
  }, [navigate, resetErrors, resetPassword, setErrors, t, token, values]);

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
            <Text weight="semibold">{t('resetPassword.title')}</Text>
            <Text size="sm" tone="muted">
              {t('resetPassword.description')}
            </Text>
          </Stack>

          {!token && (
            <Text size="sm" tone="destructive" role="alert">
              {t('resetPassword.missingToken')}
            </Text>
          )}

          {errors._general && (
            <Text size="sm" tone="destructive" role="alert">
              {errors._general}
            </Text>
          )}

          <Group label={t('resetPassword.newPassword')}>
            <Input
              {...r('password', 'password')}
              autoComplete="new-password"
              disabled={isPending || !token}
              placeholder={t('resetPassword.newPassword')}
            />
          </Group>

          <Group label={t('resetPassword.confirmNewPassword')}>
            <Input
              {...r('confirmPassword', 'password')}
              autoComplete="new-password"
              disabled={isPending || !token}
              placeholder={t('resetPassword.repeatNewPassword')}
            />
          </Group>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !token}
          >
            {isPending ? t('resetPassword.resetting') : t('resetPassword.submit')}
          </Button>

          <Button asChild type="button" variant="ghost" className="w-full">
            <Link to="/">{t('resetPassword.backToLogin')}</Link>
          </Button>
        </form>
      </Surface>
    </main>
  );
});

ResetPassword.displayName = 'ResetPassword';

export { ResetPassword };
