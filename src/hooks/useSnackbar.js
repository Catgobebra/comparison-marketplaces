import { useState } from 'react';

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'info',
    message: '',
  });

  const setSnackbarState = (newState) => {
    setSnackbar(prev => ({ ...prev, ...newState }));
  };

  return {
    snackbar,
    setSnackbarState,
  };
};