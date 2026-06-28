import {
  getLocalStorageItem,
  LocalStorageKey,
  removeLocalStorageItem,
  setLocalStorageItem
} from '@/helpers/storage';
import { queryClient } from '@/lib/query-client';
import { resetTRPCClient } from '@/lib/trpc';
import { store } from '../store';
import { authSliceActions, type TAuthState } from './slice';

export const initializeAuth = () => {
  const token = getLocalStorageItem(LocalStorageKey.TOKEN);

  if (!token) {
    store.dispatch(authSliceActions.resetState());
    return;
  }

  store.dispatch(authSliceActions.startSession());
};

export const setAuthToken = async (token: string) => {
  setLocalStorageItem(LocalStorageKey.TOKEN, token);
  queryClient.clear();
  await resetTRPCClient();
  store.dispatch(authSliceActions.startSession());
};

export const setAuthUser = (
  user: Pick<TAuthState, 'userId' | 'email' | 'isAdmin'>
) => store.dispatch(authSliceActions.setUser(user));

export const logout = async () => {
  removeLocalStorageItem(LocalStorageKey.TOKEN);
  queryClient.clear();
  await resetTRPCClient();
  store.dispatch(authSliceActions.resetState());
};
