import { useAuthLoading } from '@/features/auth/hooks';
import { useAuthController } from '@/hooks/use-auth-controller';
import { memo } from 'react';
import { AppLoading } from '../app-loading';
import { AppShell } from '../app-shell';
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
      <AppShell />
    </>
  );
});

export { App };
