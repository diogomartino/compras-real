import type { TUser } from '@myapp/shared';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TAuthState = {
  loading: boolean;
  hasSession: boolean;
  userId: string | undefined;
  email: TUser['email'] | undefined;
  avatarUrl: TUser['avatarUrl'] | undefined;
  isAdmin: TUser['isAdmin'];
};

const initialState: TAuthState = {
  hasSession: false,
  userId: undefined,
  email: undefined,
  avatarUrl: undefined,
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
      state.avatarUrl = undefined;
      state.isAdmin = false;
      state.loading = true;
    },
    setUser: (
      state,
      action: PayloadAction<
        Pick<TAuthState, 'userId' | 'email' | 'avatarUrl' | 'isAdmin'>
      >
    ) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.avatarUrl = action.payload.avatarUrl;
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
