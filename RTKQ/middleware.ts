import { isRejected, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { showSnackbar } from './snackbarSlice';

const errorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejected(action)) {
      api.dispatch(
        showSnackbar({
          severity: 'error',
          message: action.payload.data.message,
        })
      );
    }
    return next(action);
  };

export { errorMiddleware };
