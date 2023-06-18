/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import TextField from '@/components/FormUI/TextField';
import MUIAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useAuthDispatch, useAuthState } from '@/contexts/auth';

import Image from 'next/image';

type LoginValue = {
  username: string;
  password: string;
};

const INITIAL_FORM_STATE = {
  username: '',
  password: '',
};
const FORM_VALIDATION = Yup.object().shape({
  username: Yup.string().required('Username harus diisi'),
  password: Yup.string().required('Password harus diisi'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const [errors, setErrors] = useState<any | null>(null);
  const [openSnack, setOpenSnack] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (authenticated || loginStatus) {
      router.push('/');
    }
  }, [authenticated, router, loginStatus]);

  useEffect(() => {
    router.prefetch('/');
  }, [router]);

  const handleClose = (_event?: any, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const mutation = useMutation(
    async (data: LoginValue) => {
      return axios.post('/api/auth/login', data);
    },
    {
      onSuccess: (data) => {
        dispatch && dispatch('LOGIN', data?.data);
        setLoginStatus(true);
        router.push('/');
      },
      onError: (error: any) => {
        setErrors(error?.response.data);
        setOpenSnack(true);
      },
    },
  );

  const handleFormSubmit = async (values: LoginValue, { resetForm }: any) => {
    const { username, password } = values;
    const payload = {
      username,
      password,
    };
    mutation.mutate(payload);
    resetForm();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
          paddingRight: '10%',
          paddingLeft: '10%',
        }}
      >
        <Image
          width={80}
          height={80}
          src="/images/boxicon.png"
          alt="main logo"
        />
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Formik
          key={loginStatus ? 'loggedin' : 'loggedout'}
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} onFocus={() => setOpenSnack(false)}>
              <Box component="div" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  size="small"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="small"
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Typography variant="body2" align="center">
                      Ada masalah? silahkan hubungi RT.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errors?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
