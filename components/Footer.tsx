import React from 'react';
import Instagram from '@mui/icons-material/Instagram';
import Language from '@mui/icons-material/Language';
import Facebook from '@mui/icons-material/Facebook';
import Twitter from '@mui/icons-material/Twitter';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'© KPPBC TMP C Ambon '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: 'inherit',
        bottom: 0,
        padding: '3rem 0 1rem',
        marginBottom: { xs: '2rem' },
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          {/* eslint-disable jsx-a11y/accessible-emoji */}
          Made with <span>💜</span>
        </Typography>
        <Copyright />
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '0.5rem 0 0.5rem',
          }}
        >
          <Divider style={{ width: '15rem' }} variant="middle" />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '15rem',
            }}
          >
            <a href="#">
              <IconButton>
                <Instagram />
              </IconButton>
            </a>
            <a href="#">
              <IconButton>
                <Facebook />
              </IconButton>
            </a>
            <a href="#">
              <IconButton>
                <Twitter />
              </IconButton>
            </a>
            <a href="https://bcambon.beacukai.go.id/">
              <IconButton>
                <Language />
              </IconButton>
            </a>
          </div>
        </div>
      </Container>
    </Box>
  );
}
