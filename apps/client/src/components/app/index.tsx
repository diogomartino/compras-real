import { useAuthLoading } from '@/features/auth/hooks';
import { useAuthController } from '@/hooks/use-auth-controller';
import { memo } from 'react';
import { AppLoading } from '../app-loading';
import { Routing } from '../routing';
import { ShoppingGuard } from '../shopping-guard';

const App = memo(() => {
  const authLoading = useAuthLoading();

  useAuthController();

  if (authLoading) {
    return <AppLoading />;
  }

  return (
    <>
      <ShoppingGuard />
      <Routing />
    </>
  );
});

export { App };
