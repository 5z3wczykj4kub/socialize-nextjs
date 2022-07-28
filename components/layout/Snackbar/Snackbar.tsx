import { useTheme } from '@mui/material/styles';
import { Snackbar as MuiSnackbar, useMediaQuery } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { forwardRef, SyntheticEvent } from 'react';
import { hideSnackbar, selectSnackbar } from '../../../RTKQ/snackbarSlice';
import { useAppDispatch, useAppSelector } from '../../../RTKQ/store';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  <MuiAlert ref={ref} variant='filled' elevation={6} {...props} />
));

const Snackbar = () => {
  const { isOpen, severity, message } = useAppSelector(selectSnackbar);

  const dispatch = useAppDispatch();

  const handleSnackbarClose = (
    event?: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    dispatch(hideSnackbar());
  };

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <MuiSnackbar
      open={isOpen}
      autoHideDuration={6000}
      anchorOrigin={{
        vertical: matches ? 'bottom' : 'top',
        horizontal: 'right',
      }}
      onClose={handleSnackbarClose}
    >
      <Alert
        severity={severity}
        onClose={handleSnackbarClose}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
