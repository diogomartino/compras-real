import { configureStore } from '@reduxjs/toolkit';
import { appSliceReducer } from './app/slice';
import { authSliceReducer } from './auth/slice';
import { dialogSliceReducer } from './dialogs/slice';

export const store = configureStore({
  reducer: {
    app: appSliceReducer,
    dialog: dialogSliceReducer,
    auth: authSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type IRootState = ReturnType<typeof store.getState>;
