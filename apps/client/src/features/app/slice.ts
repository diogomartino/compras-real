import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TAppState {
  loading: boolean;
  /** A full-screen sub-view (e.g. a form) is active — hide the app chrome. */
  fullscreen: boolean;
}

const initialState: TAppState = {
  loading: true,
  fullscreen: false
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFullscreen: (state, action: PayloadAction<boolean>) => {
      state.fullscreen = action.payload;
    }
  }
});

const appSliceActions = appSlice.actions;
const appSliceReducer = appSlice.reducer;

export { appSliceActions, appSliceReducer };
