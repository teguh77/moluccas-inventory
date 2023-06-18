/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import Cached from '@mui/icons-material/Cached';
import ViewStream from '@mui/icons-material/ViewStream';
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';
import FilterList from '@mui/icons-material/FilterList';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MUIAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { add } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/contexts/auth';
import { Product } from '@/lib/types';
import { useQueryClient } from 'react-query';

const numberFormatterInRupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
});
const numberFormatter = new Intl.NumberFormat();

import Table from '@mui/material/Table';
import Loading from '@/components/Loading';
import Popper from '@mui/material/Popper';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type Props = {
  filterFn: { fn: (items: Product[]) => Product[] };
};

type CustomProduct = {
  products: Product[];
  totalValue: number;
};

const StockTable = ({ filterFn }: Props) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();
  const [product, setProduct] = useState<CustomProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<any | null>(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popper' : undefined;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const detailHandler = (stockId: any) => {
    router.push(`stock/${stockId}`);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - (product?.products?.length || 0))
      : 0;

  async function getStock() {
    try {
      if (startDate === null || endDate === null) {
        const { data } = await axios.get(`/api/reports/products`);
        setProduct(data);
        setLoading(false);
      } else {
        const customStart = new Date(startDate.setHours(0, 0, 0, 0));
        const customEnd = add(new Date(endDate).setHours(0, 0, 0, 0), {
          days: 1,
        });
        const { data } = await axios.get(
          `/api/reports/products/${customStart}/${customEnd}`,
        );
        setProduct(data);
        setLoading(false);
      }
    } catch (error: any) {
      if (authenticated) {
        setErrors(error.response.data);
      }
      router.push('/login');
    }
  }

  useEffect(() => {
    getStock();
    return () => {
      queryClient.invalidateQueries('stocks');
    };
  }, [startDate, endDate]);

  return loading ? (
    <Loading />
  ) : (
    <Paper
      style={{
        borderRadius: 10,
        border: '1px solid #E5E8EC',
        padding: '1rem 2rem 2rem',
      }}
      elevation={0}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
            <ViewStream style={{ color: 'white' }} />
          </Avatar>
        }
        title="Barang Persediaan"
        action={
          <IconButton onClick={handleClick}>
            <FilterList color="primary" />
          </IconButton>
        }
      />
      <TableContainer
        component="div"
        style={{
          marginBottom: '1rem',
          border: '1px solid #E5E8EC',
          borderRadius: 5,
          overflow: 'auto',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="a dense table" size="small">
          <TableHead>
            <TableRow style={{ backgroundColor: '#041A4D' }}>
              <TableCell align="center" style={{ color: '#fff' }}>
                Nomor
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Kategori
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Kode Barang
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Nama Barang
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Stok
              </TableCell>
              <TableCell align="right" style={{ color: '#fff' }}>
                Harga
              </TableCell>
              <TableCell align="right" style={{ color: '#fff' }}>
                Nilai
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Detail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product?.products?.length !== 0 &&
              filterFn
                .fn(product?.products || [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((p, idx: number) => (
                  <TableRow
                    key={p.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {rowsPerPage * page + idx + 1}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {p.category}
                    </TableCell>
                    <TableCell align="center">{p.code}</TableCell>
                    <TableCell
                      align="center"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {p.name}
                    </TableCell>
                    <TableCell align="center">
                      {numberFormatter.format(p.latestQuantity)}
                    </TableCell>
                    <TableCell align="right">
                      {numberFormatterInRupiah.format(p.price)}
                    </TableCell>
                    <TableCell align="right">
                      {numberFormatterInRupiah.format(p.value)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => detailHandler(p.id)}>
                        <ListAltOutlined color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 52.5 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div
          style={{
            display: 'flex',
            padding: '0.5rem 1rem',
            border: '1px solid #E5E8EC',
            borderRadius: 5,
          }}
        >
          <Typography variant="body1">Total Nilai :</Typography>
          <Typography
            variant="body1"
            style={{ marginLeft: '2rem', fontWeight: 'bold' }}
          >
            {numberFormatterInRupiah.format(product?.totalValue || 0)}
          </Typography>
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage=""
        component="div"
        count={product?.products?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="top-end"
        style={{
          backgroundColor: '#fff',
          borderRadius: 5,
          padding: '1rem',
          border: '1px solid #E5E8EC',
        }}
      >
        <Grid
          container
          spacing={1}
          sx={{ width: { xs: '10rem', md: '20rem' } }}
        >
          <Grid
            item
            xs={12}
            md={5}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start"
                value={startDate}
                onChange={(newValue: any) => {
                  setStartDate(newValue);
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            item
            xs={12}
            md={5}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End"
                value={endDate}
                onChange={(newValue: any) => {
                  setEndDate(newValue);
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid
            item
            xs={12}
            md={2}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              color="primary"
              aria-label="upload picture"
              onClick={handleReset}
            >
              <Cached />
            </IconButton>
          </Grid>
        </Grid>
      </Popper>
    </Paper>
  );
};

export default StockTable;
