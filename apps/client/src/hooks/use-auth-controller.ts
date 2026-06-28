import { initializeAuth, logout, setAuthUser } from '@/features/auth/actions';
import { useHasAuthSession } from '@/features/auth/hooks';
import { useGetAuthedUser } from '@/queries/auth';
import { useEffect } from 'react';

const useAuthController = () => {
  const hasSession = useHasAuthSession();
  const { data: user, isError, isFetched } = useGetAuthedUser(hasSession);

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!hasSession || !isFetched) {
      return;
    }

    if (isError || !user) {
      void logout();
      return;
    }

    setAuthUser({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin
    });
  }, [user, hasSession, isError, isFetched]);
};

export { useAuthController };
