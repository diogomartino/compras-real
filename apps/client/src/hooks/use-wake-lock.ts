import { useEffect } from 'react';

type TWakeLockSentinel = {
  release: () => Promise<void>;
};

type TWakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: 'screen') => Promise<TWakeLockSentinel>;
  };
};

const useWakeLock = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const wakeLockNavigator = navigator as TWakeLockNavigator;

    if (!wakeLockNavigator.wakeLock) {
      return;
    }

    let sentinel: TWakeLockSentinel | undefined;
    let cancelled = false;

    const requestWakeLock = async () => {
      try {
        sentinel = await wakeLockNavigator.wakeLock?.request('screen');

        if (cancelled) {
          await sentinel?.release().catch(() => undefined);
          sentinel = undefined;
        }
      } catch {
        sentinel = undefined;
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !sentinel) {
        requestWakeLock();
      }
    };

    requestWakeLock();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      sentinel?.release().catch(() => undefined);
      sentinel = undefined;
    };
  }, [enabled]);
};

export { useWakeLock };
