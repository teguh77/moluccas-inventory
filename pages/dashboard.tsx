/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import BarChart from '@mui/icons-material/BarChart';
import TrackChanges from '@mui/icons-material/TrackChanges';
import Favorite from '@mui/icons-material/Favorite';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { AlertProps } from '@mui/material/Alert';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { useAuthState } from '@/contexts/auth';
import axios from 'axios';
import MobileAppbar from '@/components/dashboard/MobileAppbar';
import TextField from '@mui/material/TextField';
import { TStock } from '@/lib/types';
import Loading from '@/components/Loading';
import MUIAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import InfoCard from '@/components/dashboard/InfoCard';
import Popular from '@/components/dashboard/Popular';

const LineChart = dynamic(() => import('@/components/dashboard/LineChart'));
const RadarChart = dynamic(() => import('@/components/dashboard/RadarChart'));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Dashboard = () => {
  const router = useRouter();
  const dateNow = new Date();
  const popularDate = format(dateNow, 'dd MMM, yyyy');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [stocks, setStocks] = useState<TStock | null>(null);
  const [errors, setErrors] = useState<any | null>(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();

  async function loadData() {
    const { data } = await axios.get<TStock>(`/api/stocks/out/${selectedDate}`);
    setStocks(data);
    setIsLoading(false);
  }
  useEffect(() => {
    try {
      setIsLoading(true);
      loadData();
    } catch (error: any) {
      if (authenticated) {
        setErrors(error.response.data);
      }
      router.push('/login');
    }
  }, [selectedDate, authenticated]);
  return (
    <main>
      <Box sx={{ display: { md: 'none' } }}>
        <MobileAppbar
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
        />
      </Box>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex',
          },
          justifyContent: {
            md: 'flex-end',
          },
          marginBottom: {
            md: '1.5rem',
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year']}
            label="Tahun"
            value={selectedDate}
            onChange={(newValue: any) => {
              setSelectedDate(newValue);
            }}
          />
        </LocalizationProvider>
      </Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid
          container
          sx={{
            flexGrow: 1,
          }}
          spacing={4}
        >
          <Grid item md={8} xs={12}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InfoCard
                categoryTotal={stocks?.categoryTotal}
                productTotal={stocks?.productTotal}
                stockOutTotal={stocks?.stockOutTotal}
              />
            </div>
            <Paper
              sx={{
                margin: { xs: '2rem 0 0 0', md: '2rem 0 2rem' },
                position: 'relative',
                borderRadius: 3,
                border: '1px solid #E5E8EC',
              }}
              elevation={0}
            >
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    style={{ backgroundColor: '#041A4D' }}
                  >
                    <BarChart style={{ color: 'white' }} />
                  </Avatar>
                }
                title="Tingkat Permintaan Produk"
                subheader="Line"
              />
              <div style={{ overflow: 'auto' }}>
                <LineChart stocks={stocks?.stockOut} />
              </div>
            </Paper>
          </Grid>
          <Grid item container md={4} xs={12} style={{ flexGrow: 1 }}>
            <Grid
              item
              md={12}
              xs={12}
              sx={{ marginBottom: { xs: '2rem', md: 0 } }}
            >
              <Paper
                style={{
                  height: '24rem',
                  borderRadius: 10,
                  border: '1px solid #E5E8EC',
                }}
                elevation={0}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="recipe"
                      style={{ backgroundColor: '#041A4D' }}
                    >
                      <TrackChanges style={{ color: 'white' }} />
                    </Avatar>
                  }
                  title="Tingkat Permintaan Produk"
                  subheader="Radar"
                />
                <RadarChart stocks={stocks?.stockOut} />
              </Paper>
            </Grid>
            <Grid item md={12} xs={12}>
              <Paper
                elevation={0}
                style={{
                  minHeight: '21rem',
                  borderRadius: 10,
                  border: '1px solid #E5E8EC',
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="recipe"
                      style={{ backgroundColor: '#041A4D' }}
                    >
                      <Favorite style={{ color: 'white' }} />
                    </Avatar>
                  }
                  title="Produk Terlaris"
                  subheader={popularDate}
                />
                <Popular stocks={stocks?.stockOut} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert
          onClose={() => setOpenSnack(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {`Mohon maaf terjadi error : ${errors?.message}`}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Dashboard;
