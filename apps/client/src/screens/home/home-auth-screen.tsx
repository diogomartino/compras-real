import { Heading, Stack, Surface, Text } from '@/components/ds';
import {
  GoogleAuthButton,
  GoogleAuthSeparator
} from '@/components/google-auth-button';
import { Button } from '@/components/ui/button';
import { Group } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from '@/hooks/use-form';
import {
  useLogin,
  useRegister,
  useRequestPasswordReset
} from '@/mutations/auth';
import { memo, useCallback, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type TLoginForm = {
  email: string;
  password: string;
};

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const LoginForm = memo(() => {
  const { t } = useTranslation();
  const { mutateAsync: login, isPending } = useLogin();
  const {
    mutateAsync: requestPasswordReset,
    isPending: requestPasswordResetPending
  } = useRequestPasswordReset();
  const [forgotPassword, setForgotPassword] = useState(false);
  const { setTrpcErrors, values, errors, r } = useForm<TLoginForm>({
    email: '',
    password: ''
  });

  const submit = useCallback(async () => {
    try {
      await login(values);
    } catch (error) {
      setTrpcErrors(error);
    }
  }, [login, setTrpcErrors, values]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    },
    [submit]
  );

  const showForgotPassword = useCallback(() => {
    setForgotPassword(true);
  }, []);

  const hideForgotPassword = useCallback(() => {
    setForgotPassword(false);
  }, []);

  const submitPasswordReset = useCallback(async () => {
    try {
      await requestPasswordReset({ email: values.email });
      toast.success(t('home.auth.resetLinkSent'));
      setForgotPassword(false);
    } catch (error) {
      setTrpcErrors(error);
    }
  }, [requestPasswordReset, setTrpcErrors, t, values.email]);

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {errors._general && (
        <Text tone="destructive" size="sm" role="alert">
          {errors._general}
        </Text>
      )}

      {forgotPassword && (
        <Text size="sm" tone="muted">
          {t('home.auth.forgotPasswordHelp')}
        </Text>
      )}

      <Group label={t('home.auth.email')}>
        <Input
          {...r('email', 'email')}
          autoComplete="email"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending || requestPasswordResetPending}
          onEnter={forgotPassword ? submitPasswordReset : submit}
          placeholder={t('home.auth.emailPlaceholder')}
        />
      </Group>

      {!forgotPassword && (
        <Group label={t('home.auth.password')}>
          <Input
            {...r('password', 'password')}
            autoComplete="current-password"
            className="h-12 rounded-xl bg-background/70"
            disabled={isPending}
            onEnter={submit}
            placeholder={t('home.auth.password')}
          />
        </Group>
      )}

      {!forgotPassword && (
        <Button
          type="button"
          variant="ghost"
          className="h-auto px-0 text-sm"
          onClick={showForgotPassword}
        >
          {t('home.auth.forgotPassword')}
        </Button>
      )}

      <Button
        className="h-12 w-full rounded-xl"
        disabled={isPending || requestPasswordResetPending}
        type={forgotPassword ? 'button' : 'submit'}
        onClick={forgotPassword ? submitPasswordReset : undefined}
      >
        {forgotPassword
          ? requestPasswordResetPending
            ? t('home.auth.sending')
            : t('home.auth.sendResetLink')
          : isPending
            ? t('home.auth.loggingIn')
            : t('home.auth.logIn')}
      </Button>

      {!forgotPassword && (
        <>
          <GoogleAuthSeparator />

          <GoogleAuthButton>{t('home.auth.loginWithGoogle')}</GoogleAuthButton>
        </>
      )}

      {forgotPassword && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={hideForgotPassword}
        >
          {t('home.auth.backToLogin')}
        </Button>
      )}
    </form>
  );
});

const RegisterForm = memo(() => {
  const { t } = useTranslation();
  const { mutateAsync: register, isPending } = useRegister();
  const { setTrpcErrors, values, errors, r } = useForm<TRegisterForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const submit = useCallback(async () => {
    try {
      await register(values);
    } catch (error) {
      setTrpcErrors(error);
    }
  }, [register, setTrpcErrors, values]);

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit();
    },
    [submit]
  );

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {errors._general && (
        <Text tone="destructive" size="sm" role="alert">
          {errors._general}
        </Text>
      )}

      <Group label={t('home.auth.name')}>
        <Input
          {...r('name')}
          autoComplete="name"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder={t('home.auth.namePlaceholder')}
        />
      </Group>

      <Group label={t('home.auth.email')}>
        <Input
          {...r('email', 'email')}
          autoComplete="email"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder={t('home.auth.emailPlaceholder')}
        />
      </Group>

      <Group label={t('home.auth.password')}>
        <Input
          {...r('password', 'password')}
          autoComplete="new-password"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder={t('home.auth.createPassword')}
        />
      </Group>

      <Group label={t('home.auth.confirmPassword')}>
        <Input
          {...r('confirmPassword', 'password')}
          autoComplete="new-password"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder={t('home.auth.repeatPassword')}
        />
      </Group>

      <Button className="h-12 w-full rounded-xl" disabled={isPending}>
        {isPending ? t('home.auth.creatingAccount') : t('home.auth.createAccount')}
      </Button>

      <GoogleAuthSeparator />

      <GoogleAuthButton>{t('home.auth.registerWithGoogle')}</GoogleAuthButton>
    </form>
  );
});

const HomeAuthScreen = memo(() => {
  const { t } = useTranslation();
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto grid min-h-dvh w-full max-w-5xl content-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:px-8">
        <Stack gap="lg" className="mx-auto max-w-xl self-center lg:mx-0">
          <Stack gap="sm">
            <Heading level={1} size="display">
              {t('home.auth.heroTitle')}
            </Heading>
            <Text size="lg" tone="muted" className="max-w-md">
              {t('home.auth.heroSubtitle')}
            </Text>
          </Stack>
        </Stack>

        <Surface
          variant="elevated"
          radius="xl"
          padding="lg"
          className="mx-auto w-full max-w-md self-center bg-card/90"
        >
          <Stack gap="md">
            <Heading level={2} size="h3" className="text-center">
              {t('home.auth.welcome')}
            </Heading>

            <Tabs defaultValue="login" className="gap-5">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">
                  {t('home.auth.loginTab')}
                </TabsTrigger>
                <TabsTrigger value="register">
                  {t('home.auth.registerTab')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </Stack>
        </Surface>
      </div>
    </main>
  );
});

LoginForm.displayName = 'LoginForm';
RegisterForm.displayName = 'RegisterForm';
HomeAuthScreen.displayName = 'HomeAuthScreen';

export { HomeAuthScreen };
