import {
  configureStore,
  isRejected,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { api } from './api';

// TODO: Move somewhere else
const errorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejected(action)) {
      alert(action.payload.data.message);
    }
    return next(action);
  };

const store = configureStore({
  reducer: {
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
