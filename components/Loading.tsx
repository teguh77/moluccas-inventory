import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import DotLoader from 'react-spinners/DotLoader';

export default function Loading(): JSX.Element {
  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
      <DotLoader size={70} color="#041A4D90" />
    </Backdrop>
  );
}
