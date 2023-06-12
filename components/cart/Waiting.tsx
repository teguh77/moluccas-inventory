import React from 'react';
import Typography from '@mui/material/Typography';
import ClockLoader from 'react-spinners/ClockLoader';

const Waiting = () => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '33rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 2rem 2rem',
          maxWidth: '40rem',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          style={{ textAlign: 'center', padding: '0 4rem' }}
        >
          Permohonan telah disampaikan ke KSBU, mohon ditunggu sebentar ya.
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '19rem',
          }}
        >
          <ClockLoader color="#041A4D" size={200} />
        </div>
      </div>
    </div>
  );
};

export default Waiting;
