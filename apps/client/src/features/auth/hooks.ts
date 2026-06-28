import { useSelector } from 'react-redux';
import {
  authLoadingSelector,
  authSelector,
  hasAuthSessionSelector,
  isAdminSelector,
  isAuthenticatedSelector,
  userIdSelector
} from './selectors';

export const useAuth = () => useSelector(authSelector);

export const useAuthLoading = () => useSelector(authLoadingSelector);

export const useHasAuthSession = () => useSelector(hasAuthSessionSelector);

export const useOwnUserId = () => useSelector(userIdSelector);

export const useIsAdmin = () => useSelector(isAdminSelector);

export const useIsAuthenticated = () => useSelector(isAuthenticatedSelector);
