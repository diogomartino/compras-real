import { closeDialogs } from '@/features/dialogs/actions';
import { useDialogInfo } from '@/features/dialogs/hooks';
import { createElement, memo } from 'react';
import ConfirmActionDialog from './confirm-action';
import { Dialog } from './dialogs';
import LoginDialog from './login';
import RegisterDialog from './register';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DialogsMap: any = {
  [Dialog.CONFIRM_ACTION]: ConfirmActionDialog,
  [Dialog.LOGIN]: LoginDialog,
  [Dialog.REGISTER]: RegisterDialog
};

const DialogsProvider = memo(() => {
  const { isOpen, openDialog, props, closing } = useDialogInfo();

  if (!openDialog || !DialogsMap[openDialog]) return null;

  const realIsOpen = isOpen && !closing;

  return createElement(DialogsMap[openDialog], {
    ...props,
    isOpen: realIsOpen,
    close: closeDialogs
  });
});

export { DialogsProvider };
