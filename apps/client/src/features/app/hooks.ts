import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setFullscreen } from './actions';
import { appFullscreenSelector, appLoadingSelector } from './selectors';

export const useIsAppLoading = () => useSelector(appLoadingSelector);

export const useIsFullscreen = () => useSelector(appFullscreenSelector);

/**
 * Mark the current screen as a full-screen sub-view (hides the bottom nav).
 * Call from form/detail screens that render their own chrome.
 */
export const useFullscreenScreen = () => {
  useEffect(() => {
    setFullscreen(true);

    return () => {
      setFullscreen(false);
    };
  }, []);
};
