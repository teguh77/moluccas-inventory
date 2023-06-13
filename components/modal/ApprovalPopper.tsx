/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import AddBox from '@mui/icons-material/AddBox';
import Block from '@mui/icons-material/Block';
import FilterTiltShift from '@mui/icons-material/FilterTiltShift';
import IndeterminateCheckBox from '@mui/icons-material/IndeterminateCheckBox';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { Product, User } from '@/lib/types';
import { IncartDetail } from '@prisma/client';
import { ProductContext, ProductContextProps } from '@/contexts/product';

import GeneralModal from '@/components/modal/GeneralModal';
import Loading from '@/components/Loading';

type AdujustmentProps = {
  incartsUpdate: IncartDetail[];
  setIncartsUpdate: (value: any) => any;
  id: string;
  incart: number;
  productQuantity: number;
  setProductQuantity: (value: any) => any;
  quantity: number;
};

type TIncart = {
  id: string;
  user: User;
  notifCarts: IncartDetail[];
};

function setLocalStorage(key: string, value: any) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

// eslint-disable-next-line consistent-return
function getLocalStorage(key: string, initialValue: any) {
  try {
    if (typeof window !== 'undefined') {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    }
    return initialValue;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}
// eslint-disable-next-line consistent-return
function deleteLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

function RenderAdjusment({
  incartsUpdate,
  setIncartsUpdate,
  id,
  productQuantity,
  incart,
  setProductQuantity,
  quantity,
}: AdujustmentProps) {
  const increase = () => {
    if (productQuantity > quantity) {
      setProductQuantity(quantity);
    } else {
      setProductQuantity((prev: number) => prev + 1);
    }
  };
  const decrease = () => {
    if (productQuantity <= 1) {
      setProductQuantity(1);
    } else {
      setProductQuantity((prev: number) => prev - 1);
    }
  };

  useEffect(() => {
    const updated = incartsUpdate?.map((c: IncartDetail) =>
      c.id === id ? { ...c, productIncart: productQuantity } : c,
    );
    setIncartsUpdate(updated);
  }, [productQuantity]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={decrease}>
        <IndeterminateCheckBox />
      </IconButton>
      <Typography variant="body2" style={{ margin: '0 .5rem' }}>
        {incart}
      </Typography>
      <IconButton
        onClick={increase}
        disabled={quantity - productQuantity === 0}
      >
        {quantity - productQuantity === 0 ? <Block /> : <AddBox />}
      </IconButton>
    </div>
  );
}

type RowProps = {
  key: any;
  incart: IncartDetail;
  idx: number;
  setIncartsUpdate: Dispatch<SetStateAction<IncartDetail[]>>;
  incartsUpdate: IncartDetail[];
};

function Row({
  incartsUpdate,
  incart: baseIncart,
  idx,
  setIncartsUpdate,
}: RowProps) {
  const {
    id,
    productId,
    productName,
    productCategory,
    productIncart: incart,
    productQuantity: quantity,
    productCode,
  } = baseIncart;
  const [open, setOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState(incart);
  const { products } = useContext(ProductContext) as ProductContextProps;
  const [product, setProduct] = useState<Product | null>(null);
  const dropdownHandler = (uniqId: string) => {
    const productFound = products?.find((product) => product.id == uniqId);
    productFound && setProduct(productFound);
    setOpen(!open);
  };

  const adjustmentProps = {
    incartsUpdate,
    setIncartsUpdate,
    id,
    incart,
    productQuantity,
    setProductQuantity,
    quantity,
  };

  return (
    <>
      <TableRow sx={{ '& > *': { border: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => dropdownHandler(productId)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {idx + 1}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {productCode}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {productCategory}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {productName}
        </TableCell>
        <TableCell align="center">{RenderAdjusment(adjustmentProps)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: '2rem' }}>
              <Table
                aria-label="purchases"
                style={{ border: '1px solid #E5E8EC' }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Kode Barang</TableCell>
                    <TableCell align="center">Nama Barang</TableCell>
                    <TableCell align="center">Harga Satuan</TableCell>
                    <TableCell align="center">Jumlah Stok</TableCell>
                    <TableCell align="center" style={{ maxWidth: '15rem' }}>
                      Keterangan
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      align="center"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {product?.code}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {product?.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {product?.price}
                    </TableCell>
                    <TableCell align="center">
                      {product?.latestQuantity}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {product?.productDesc}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

type TableProps = {
  userId: string;
  setOpen: (value: boolean) => void;
  notifId: string;
};

export default function CollapsibleTable({
  userId,
  setOpen,
  notifId,
}: TableProps) {
  const [loading, setLoading] = useState(true);
  const [incartsUpdate, setIncartsUpdate] = useState<IncartDetail[]>(() =>
    getLocalStorage('incarts', []),
  );

  const queryClient = useQueryClient();

  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalReject, setOpenModalReject] = useState(false);

  const updateIncartsMutation = useMutation(
    (data: any) => {
      return axios.patch('/api/incarts', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('incarts');
      },
    },
  );

  const updateNotifMutation = useMutation(
    (id) => {
      return axios.patch(`/api/notifs/stockout/approval/${id}`, {
        status: 'APPROVED',
        description: 'KSBU Telah Menyetujui',
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
      },
    },
  );

  const modalHandler = async () => {
    setOpenModalConfirm(true);
  };

  const handleApprove = async () => {
    try {
      updateIncartsMutation.mutate({ incarts: incartsUpdate });
      updateNotifMutation.mutate(notifId as any);
    } catch (err: any) {
      throw new Error(err);
    } finally {
      setIncartsUpdate([]);
      deleteLocalStorage('incarts');
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(true);
      return;
    }
    const setIncart = async () => {
      const { data } = await axios.get<TIncart>(`/api/incarts/${userId}`);

      setIncartsUpdate((prev: IncartDetail[]) =>
        prev?.length !== 0 ? prev : data?.notifCarts,
      );
      setLoading(false);
    };
    setIncart();
  }, [userId]);

  useEffect(() => {
    setLocalStorage('incarts', incartsUpdate);
  }, [incartsUpdate]);

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
            <FilterTiltShift style={{ color: 'white' }} />
          </Avatar>
        }
        title="Detail Permohonan Barang"
      />
      <Paper
        style={{
          borderRadius: 10,
          border: '1px solid #E5E8EC',
          margin: '1rem 0 2rem 0',
        }}
        elevation={0}
      >
        <TableContainer component="div" style={{ borderRadius: 10 }}>
          <Table aria-label="collapsible table" size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: '#041A4D' }}>
                <TableCell />
                <TableCell align="center" style={{ color: '#fff' }}>
                  No
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Kode Barang
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Kategori
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Nama Barang
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Jumlah
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incartsUpdate?.length !== 0 &&
                incartsUpdate?.map((item, index) => (
                  <Row
                    key={index}
                    incart={item}
                    idx={index}
                    setIncartsUpdate={setIncartsUpdate}
                    incartsUpdate={incartsUpdate}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          size="small"
          color="secondary"
          variant="contained"
          onClick={() => setOpenModalReject(true)}
        >
          Reject
        </Button>
        <Button
          size="small"
          color="primary"
          variant="contained"
          style={{ marginLeft: '1rem' }}
          onClick={modalHandler}
        >
          Aprrove
        </Button>
      </div>
      <GeneralModal
        open={openModalAuth}
        setOpen={setOpenModalAuth}
        text="Sesi Anda telah berakhir, mohon untuk login kembali."
        type="auth"
      />
      <GeneralModal
        handler={handleApprove}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah anda yakin?."
        type="confirm"
      />
      <GeneralModal
        notifId={notifId}
        userId={userId}
        open={openModalReject}
        setOpen={setOpenModalReject}
        setOpenApprovalPopper={setOpen}
        setIncartsUpdate={setIncartsUpdate}
        type="reject"
      />
    </Paper>
  );
}
