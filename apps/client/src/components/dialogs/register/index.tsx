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
import { useRegister } from '@/mutations/auth';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TDialogBaseProps } from '../types';

type TRegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterDialog = memo(({ isOpen, close }: TDialogBaseProps) => {
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
          <DialogTitle>{t('home.auth.createAccount')}</DialogTitle>
          <DialogDescription>
            {t('components.authDialogs.registerDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {errors._general && (
            <p className="text-sm text-destructive" role="alert">
              {errors._general}
            </p>
          )}

          <Group label={t('home.auth.name')}>
            <Input
              {...r('name')}
              autoComplete="name"
              disabled={isPending}
              onEnter={submit}
              placeholder={t('home.auth.namePlaceholder')}
            />
          </Group>

          <Group label={t('home.auth.email')}>
            <Input
              {...r('email', 'email')}
              autoComplete="email"
              disabled={isPending}
              onEnter={submit}
              placeholder={t('home.auth.emailPlaceholder')}
            />
          </Group>

          <Group label={t('home.auth.password')}>
            <Input
              {...r('password', 'password')}
              autoComplete="new-password"
              disabled={isPending}
              onEnter={submit}
              placeholder={t('home.auth.createPassword')}
            />
          </Group>

          <Group label={t('home.auth.confirmPassword')}>
            <Input
              {...r('confirmPassword', 'password')}
              autoComplete="new-password"
              disabled={isPending}
              onEnter={submit}
              placeholder={t('home.auth.repeatPassword')}
            />
          </Group>

          <GoogleAuthSeparator />

          <GoogleAuthButton>{t('home.auth.registerWithGoogle')}</GoogleAuthButton>
        </div>

        <DialogFooter className="items-center gap-2 sm:justify-between">
          <Button variant="ghost" type="button" onClick={openLogin}>
            {t('components.authDialogs.alreadyHaveAccount')}
          </Button>
          <Button type="button" disabled={isPending} onClick={submit}>
            {isPending
              ? t('components.authDialogs.creating')
              : t('home.auth.createAccount')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

RegisterDialog.displayName = 'RegisterDialog';

export default RegisterDialog;
