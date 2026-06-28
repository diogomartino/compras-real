import type { IRootState } from '../store';

export const authSelector = (state: IRootState) => state.auth;

export const hasAuthSessionSelector = (state: IRootState) =>
  state.auth.hasSession;

export const userIdSelector = (state: IRootState) => state.auth.userId;

export const authLoadingSelector = (state: IRootState) => state.auth.loading;

export const isAdminSelector = (state: IRootState) => state.auth.isAdmin;

export const isAuthenticatedSelector = (state: IRootState) =>
  !!state.auth.userId;
