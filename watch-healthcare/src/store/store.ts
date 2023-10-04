import { configureStore } from '@reduxjs/toolkit';
import watchReducer from '../components/Clock/watchSlice';

export const store = configureStore({
  reducer: {
    watch: watchReducer,
  
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
