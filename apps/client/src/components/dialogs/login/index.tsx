import { Dialog as DialogType } from '@/components/dialogs/dialogs';
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
import { useLogin } from '@/mutations/auth';
import { memo, useCallback } from 'react';
import type { TDialogBaseProps } from '../types';

type TLoginForm = {
  email: string;
  password: string;
};

const LoginDialog = memo(({ isOpen, close }: TDialogBaseProps) => {
  const { mutateAsync: login, isPending } = useLogin();
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
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            Access your account with your email and password.
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
              disabled={isPending}
              onEnter={submit}
              placeholder="you@example.com"
            />
          </Group>

          <Group label="Password">
            <Input
              {...r('password', 'password')}
              autoComplete="current-password"
              disabled={isPending}
              onEnter={submit}
              placeholder="Your password"
            />
          </Group>
        </div>

        <DialogFooter className="items-center gap-2 sm:justify-between">
          <Button variant="ghost" type="button" onClick={openRegister}>
            Create account
          </Button>
          <Button type="button" disabled={isPending} onClick={submit}>
            {isPending ? 'Logging in...' : 'Log in'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

LoginDialog.displayName = 'LoginDialog';

export default LoginDialog;
