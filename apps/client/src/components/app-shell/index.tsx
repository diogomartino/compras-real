import { AppBottomNav } from '@/components/app-bottom-nav';
import { Routing } from '@/components/routing';
import { useIsFullscreen } from '@/features/app/hooks';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { memo } from 'react';
import { useLocation } from 'react-router';

// Routes that show the persistent bottom nav (its tab targets).
const TAB_ROUTES = [
  '/base-list',
  '/catalog',
  '/categories',
  '/profile',
  '/shopping-history',
  '/household'
];

const isTabRoute = (pathname: string) =>
  pathname === '/' || TAB_ROUTES.some((route) => pathname.startsWith(route));

const AppShell = memo(() => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const fullscreen = useIsFullscreen();
  const reduceMotion = useReducedMotion();
  const showNav =
    isTabRoute(location.pathname) && isAuthenticated && !fullscreen;

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-background [-webkit-overflow-scrolling:touch]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <Routing location={location} />
        </motion.div>
      </AnimatePresence>
      {showNav && <AppBottomNav />}
    </>
  );
});

AppShell.displayName = 'AppShell';

export { AppShell };
