import { AlertColor } from '@mui/material';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface InitialState {
  isOpen: boolean;
  severity: AlertColor;
  message: string;
}

const initialState: InitialState = {
  isOpen: false,
  severity: 'success',
  message: '',
};

export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      {
        payload: { severity, message },
      }: PayloadAction<Omit<typeof initialState, 'isOpen'>>
    ) => {
      state.isOpen = true;
      state.severity = severity;
      state.message = message;
    },
    hideSnackbar: (state) => {
      state.isOpen = false;
    },
  },
});

export const selectSnackbar = (state: RootState) => state.snackbar;

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
