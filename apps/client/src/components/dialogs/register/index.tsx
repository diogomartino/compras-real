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
import { useRegister } from '@/mutations/auth';
import { memo, useCallback } from 'react';
import type { TDialogBaseProps } from '../types';

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterDialog = memo(({ isOpen, close }: TDialogBaseProps) => {
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
      close();
    } catch (error) {
      setTrpcErrors(error);
    }
  }, [close, register, setTrpcErrors, values]);

  const openLogin = useCallback(() => {
    openDialog(DialogType.LOGIN);
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
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            Register with your name, email, and password.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errors._general && (
            <p className="text-sm text-destructive" role="alert">
              {errors._general}
            </p>
          )}

          <Group label="Name">
            <Input
              {...r('name')}
              autoComplete="name"
              disabled={isPending}
              onEnter={submit}
              placeholder="Jane Doe"
            />
          </Group>

          <Group label="Email">
            <Input
              {...r('email', 'email')}
              autoComplete="email"
              disabled={isPending}
              onEnter={submit}
              placeholder="you@example.com"
            />
          </Group>

          <Group
            label="Password"
            bottomDescription="Use at least 8 characters."
          >
            <Input
              {...r('password', 'password')}
              autoComplete="new-password"
              disabled={isPending}
              onEnter={submit}
              placeholder="Create a password"
            />
          </Group>

          <Group label="Confirm password">
            <Input
              {...r('confirmPassword', 'password')}
              autoComplete="new-password"
              disabled={isPending}
              onEnter={submit}
              placeholder="Repeat your password"
            />
          </Group>
        </div>

        <DialogFooter className="items-center gap-2 sm:justify-between">
          <Button variant="ghost" type="button" onClick={openLogin}>
            Already have an account?
          </Button>
          <Button type="button" disabled={isPending} onClick={submit}>
            {isPending ? 'Creating...' : 'Create account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

RegisterDialog.displayName = 'RegisterDialog';

export default RegisterDialog;
