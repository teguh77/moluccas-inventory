import React, { ChangeEvent } from 'react';
import Search from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

type Props = {
  handleSearch: (event: ChangeEvent<HTMLInputElement>) => any;
};

const MobileAppbar = ({ handleSearch }: Props) => {
  return (
    <AppBar
      position="fixed"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.8rem 1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E8EC',
      }}
      elevation={0}
    >
      <Paper
        component="form"
        sx={{
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '17rem',
          height: 40,
          border: '1px solid #E5E8EC',
          borderRadius: 5,
        }}
        elevation={0}
      >
        <InputBase
          style={{ marginLeft: '1rem', flex: 1 }}
          placeholder="Cari..."
          onChange={handleSearch}
        />
        <IconButton style={{ padding: 10 }} aria-label="search">
          <Search />
        </IconButton>
      </Paper>
    </AppBar>
  );
};

export default MobileAppbar;
