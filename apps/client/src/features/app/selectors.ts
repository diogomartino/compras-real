import type { IRootState } from '../store';

export const appLoadingSelector = (state: IRootState) =>
  state.app.loading || state.auth.loading;

export const appFullscreenSelector = (state: IRootState) =>
  state.app.fullscreen;
