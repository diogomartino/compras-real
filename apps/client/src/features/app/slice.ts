import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface TAppState {
  loading: boolean;
}

const initialState: TAppState = {
  loading: true
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

const appSliceActions = appSlice.actions;
const appSliceReducer = appSlice.reducer;

export { appSliceActions, appSliceReducer };
