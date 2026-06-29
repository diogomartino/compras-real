import { setAuthToken, setAuthUser } from '@/features/auth/actions';
import { trpc } from '@/lib/trpc';
import type { TUser } from '@myapp/shared';
import { useMutation } from '@tanstack/react-query';

type TAuthResult = {
  token: string;
  user: TUser;
};

type TLoginInput = {
  email: string;
  password: string;
};

type TRegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TRequestPasswordResetInput = {
  email: string;
};

type TResetPasswordInput = {
  token: string;
  password: string;
  confirmPassword: string;
};

type TChangePasswordInput = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const applyAuthResult = async ({ token, user }: TAuthResult) => {
  await setAuthToken(token);
  setAuthUser({
    userId: user.id,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isAdmin: user.isAdmin
  });
};

const useLogin = () =>
  useMutation({
    mutationFn: (input: TLoginInput) => trpc.auth.login.mutate(input),
    onSuccess: applyAuthResult
  });

const useRegister = () =>
  useMutation({
    mutationFn: (input: TRegisterInput) => trpc.auth.register.mutate(input),
    onSuccess: applyAuthResult
  });

const useRequestPasswordReset = () =>
  useMutation({
    mutationFn: (input: TRequestPasswordResetInput) =>
      trpc.auth.requestPasswordReset.mutate(input)
  });

const useResetPassword = () =>
  useMutation({
    mutationFn: (input: TResetPasswordInput) =>
      trpc.auth.resetPassword.mutate(input)
  });

const useChangePassword = () =>
  useMutation({
    mutationFn: (input: TChangePasswordInput) =>
      trpc.auth.changePassword.mutate(input)
  });

export {
  useChangePassword,
  useLogin,
  useRegister,
  useRequestPasswordReset,
  useResetPassword
};
export type {
  TChangePasswordInput,
  TRequestPasswordResetInput,
  TResetPasswordInput
};
