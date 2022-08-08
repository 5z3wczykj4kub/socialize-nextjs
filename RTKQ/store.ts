import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { api } from './api';
import { errorMiddleware } from './middleware';
import snackbarReducer from './snackbarSlice';

const store = configureStore({
  reducer: {
    snackbar: snackbarReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, errorMiddleware),
});

setupListeners(store.dispatch);

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

const useAppDispatch: () => AppDispatch = useDispatch;

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type { RootState, AppDispatch };
export { store, useAppDispatch, useAppSelector };
