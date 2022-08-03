import {
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';
import { showSnackbar } from './snackbarSlice';

const errorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      api.dispatch(
        showSnackbar({
          severity: 'error',
          message: action.payload.data.message || 'Something went wrong',
        })
      );
    }
    return next(action);
  };

export { errorMiddleware };
