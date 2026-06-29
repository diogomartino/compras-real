import { useIsAuthenticated } from '@/features/auth/hooks';
import { memo } from 'react';
import { HomeAuthScreen } from './home-auth-screen';
import { HomeDashboard } from './home-dashboard';

const Home = memo(() => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  return <HomeDashboard />;
});

Home.displayName = 'Home';

export { Home };
