import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth/authSlice';
import profileReducer from './slices/profile/profileSlice';
import homeReducer from './slices/home/homeSlice';
import journalReducer from './slices/journal/journalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    home: homeReducer,
    journal: journalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
