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

const applyAuthResult = async ({ token, user }: TAuthResult) => {
  await setAuthToken(token);
  setAuthUser({
    userId: user.id,
    email: user.email,
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

export { useLogin, useRegister };
