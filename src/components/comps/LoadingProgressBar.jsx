import React from "react";
import Backdrop from "@mui/material/Backdrop";
import LinearProgress from '@mui/material/LinearProgress';

export default function LoadingProgressBar({ open }) {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1,  width: '100%'})}
      open={open}
    >
      <LinearProgress color="inherit" />
    </Backdrop>
  );
}
