import type { TUser } from '@myapp/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TAuthState = {
  loading: boolean;
  hasSession: boolean;
  userId: string | undefined;
  email: TUser['email'] | undefined;
  isAdmin: TUser['isAdmin'];
};

const initialState: TAuthState = {
  hasSession: false,
  userId: undefined,
  email: undefined,
  loading: true,
  isAdmin: false
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startSession: (state) => {
      state.hasSession = true;
      state.userId = undefined;
      state.email = undefined;
      state.isAdmin = false;
      state.loading = true;
    },
    setUser: (
      state,
      action: PayloadAction<Pick<TAuthState, 'userId' | 'email' | 'isAdmin'>>
    ) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.loading = false;
    },
    resetState: () => ({
      ...initialState,
      loading: false
    })
  }
});

const authSliceActions = authSlice.actions;
const authSliceReducer = authSlice.reducer;

export { authSliceActions, authSliceReducer };
