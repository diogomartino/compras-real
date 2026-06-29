import { Dialog as DialogType } from '@/components/dialogs/dialogs';
import {
  GoogleAuthButton,
  GoogleAuthSeparator
} from '@/components/google-auth-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Group } from '@/components/ui/group';
import { Input } from '@/components/ui/input';
import { openDialog } from '@/features/dialogs/actions';
import { useForm } from '@/hooks/use-form';
import { useLogin, useRequestPasswordReset } from '@/mutations/auth';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { TDialogBaseProps } from '../types';

type TLoginForm = {
  email: string;
  password: string;
};

const LoginDialog = memo(({ isOpen, close }: TDialogBaseProps) => {
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
      close();
    } catch (error) {
      setTrpcErrors(error);
    }
  }, [close, values, login, setTrpcErrors]);

  const openRegister = useCallback(() => {
    openDialog(DialogType.REGISTER);
  }, []);

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

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
      }
    },
    [close]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent close={close}>
        <DialogHeader>
          <DialogTitle>
            {forgotPassword ? 'Reset password' : 'Log in'}
          </DialogTitle>
          <DialogDescription>
            {forgotPassword
              ? 'Enter your email and we will send a password reset link.'
              : 'Access your account with your email and password.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errors._general && (
            <p className="text-sm text-destructive" role="alert">
              {errors._general}
            </p>
          )}

          <Group label="Email">
            <Input
              {...r('email', 'email')}
              autoComplete="email"
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

          {!forgotPassword && (
            <>
              <GoogleAuthSeparator />

              <GoogleAuthButton>Login with Google</GoogleAuthButton>
            </>
          )}
        </div>

        <DialogFooter className="items-center gap-2 sm:justify-between">
          <Button
            variant="ghost"
            type="button"
            onClick={forgotPassword ? hideForgotPassword : openRegister}
          >
            {forgotPassword ? 'Back to login' : 'Create account'}
          </Button>
          <Button
            type="button"
            disabled={isPending || requestPasswordResetPending}
            onClick={forgotPassword ? submitPasswordReset : submit}
          >
            {forgotPassword
              ? requestPasswordResetPending
                ? 'Sending...'
                : 'Send reset link'
              : isPending
                ? 'Logging in...'
                : 'Log in'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

LoginDialog.displayName = 'LoginDialog';

export default LoginDialog;
