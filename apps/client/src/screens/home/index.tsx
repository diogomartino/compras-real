import { useAuth, useIsAuthenticated } from '@/features/auth/hooks';
import { memo } from 'react';
import { HomeAuthScreen } from './home-auth-screen';
import { HomeDashboard } from './home-dashboard';

const Home = memo(() => {
  const auth = useAuth();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return <HomeDashboard email={auth.email} />;
});

Home.displayName = 'Home';

export { Home };
