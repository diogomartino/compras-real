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
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { memo, useCallback, useState, type FormEvent } from 'react';
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
      toast.success('If that email exists, a reset link has been sent.');
      setForgotPassword(false);
    } catch (error) {
      setTrpcErrors(error);
    }
  }, [requestPasswordReset, setTrpcErrors, values.email]);

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {errors._general && (
        <Text tone="destructive" size="sm" role="alert">
          {errors._general}
        </Text>
      )}

      {forgotPassword && (
        <Text size="sm" tone="muted">
          Enter your email and we will send a password reset link.
        </Text>
      )}

      <Group label="Email">
        <Input
          {...r('email', 'email')}
          autoComplete="email"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending || requestPasswordResetPending}
          onEnter={forgotPassword ? submitPasswordReset : submit}
          placeholder="you@example.com"
        />
      </Group>

      {!forgotPassword && (
        <Group label="Password">
          <Input
            {...r('password', 'password')}
            autoComplete="current-password"
            className="h-12 rounded-xl bg-background/70"
            disabled={isPending}
            onEnter={submit}
            placeholder="Your password"
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
          Forgot password?
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
            ? 'Sending...'
            : 'Send reset link'
          : isPending
            ? 'Logging in...'
            : 'Log in'}
      </Button>

      {!forgotPassword && (
        <>
          <GoogleAuthSeparator />

          <GoogleAuthButton>Login with Google</GoogleAuthButton>
        </>
      )}

      {forgotPassword && (
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={hideForgotPassword}
        >
          Back to login
        </Button>
      )}
    </form>
  );
});

const RegisterForm = memo(() => {
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

      <Group label="Name">
        <Input
          {...r('name')}
          autoComplete="name"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder="Jane Doe"
        />
      </Group>

      <Group label="Email">
        <Input
          {...r('email', 'email')}
          autoComplete="email"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder="you@example.com"
        />
      </Group>

      <Group label="Password">
        <Input
          {...r('password', 'password')}
          autoComplete="new-password"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder="Create a password"
        />
      </Group>

      <Group label="Confirm password">
        <Input
          {...r('confirmPassword', 'password')}
          autoComplete="new-password"
          className="h-12 rounded-xl bg-background/70"
          disabled={isPending}
          onEnter={submit}
          placeholder="Repeat your password"
        />
      </Group>

      <Button className="h-12 w-full rounded-xl" disabled={isPending}>
        {isPending ? 'Creating account...' : 'Create account'}
      </Button>

      <GoogleAuthSeparator />

      <GoogleAuthButton>Register with Google</GoogleAuthButton>
    </form>
  );
});

const HomeAuthScreen = memo(() => {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed -left-20 -top-20 size-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-20 size-96 rounded-full bg-accent/60 blur-3xl" />
      <div className="relative mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <Stack gap="lg" className="mx-auto max-w-xl lg:mx-0">
          <Stack gap="md">
            <Heading level={1} size="display">
              Groceries ready before you reach the shop.
            </Heading>
            <Text size="lg" tone="muted" className="max-w-lg">
              Keep the weekly list moving at home, then jump into a focused
              shopping flow when it is time to buy.
            </Text>
          </Stack>

          <div className="grid gap-3 sm:grid-cols-3">
            <Surface variant="muted" radius="2xl" padding="md">
              <Sparkles className="mb-3 size-5 text-primary" />
              <Text weight="semibold">Fast adding</Text>
              <Text size="sm" tone="muted">
                Capture items as they come up.
              </Text>
            </Surface>
            <Surface variant="muted" radius="2xl" padding="md">
              <Home className="mb-3 size-5 text-primary" />
              <Text weight="semibold">Shared home</Text>
              <Text size="sm" tone="muted">
                Designed around one household list.
              </Text>
            </Surface>
            <Surface variant="muted" radius="2xl" padding="md">
              <CheckCircle2 className="mb-3 size-5 text-primary" />
              <Text weight="semibold">Shop focused</Text>
              <Text size="sm" tone="muted">
                Open the buying flow with one tap.
              </Text>
            </Surface>
          </div>
        </Stack>

        <Surface
          variant="elevated"
          radius="2xl"
          padding="lg"
          className="mx-auto w-full max-w-md bg-card/88 backdrop-blur"
        >
          <Stack gap="lg">
            <Stack gap="xs">
              <Heading level={2} size="h3">
                Welcome home
              </Heading>
              <Text tone="muted">
                Log in or create an account to continue to your grocery space.
              </Text>
            </Stack>

            <Tabs defaultValue="login" className="gap-5">
              <TabsList className="grid h-11 w-full grid-cols-2 rounded-2xl">
                <TabsTrigger
                  className="rounded-xl data-[state=active]:from-primary data-[state=active]:to-primary data-[state=active]:text-primary-foreground"
                  value="login"
                >
                  Log in
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-xl data-[state=active]:from-primary data-[state=active]:to-primary data-[state=active]:text-primary-foreground"
                  value="register"
                >
                  Register
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
