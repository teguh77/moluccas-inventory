/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import AddBox from '@mui/icons-material/AddBox';
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
import { CartNotifContext } from '@/contexts/cartnotif';

import { CartNotifContextProps } from '@/contexts/cartnotif';
import { NotifCart, Product, User } from '@/lib/types';

import GeneralModal from '@/components/modal/GeneralModal';

import Loading from '@/components/Loading';
import { IncartDetail } from '@prisma/client';

type AdjusmentProps = {
  latestQuantity: number;
  id: string;
  productQuantity: number;
  setProductQuantity: (value: any) => any;
};

type RowProps = {
  item: NotifCart;
  idx: number;
};

type TIncart = {
  id: string;
  user: User;
  notifCarts: IncartDetail[];
};

type TableProps = {
  userId: string;
  setOpen: (value: boolean) => void;
  notifId: string;
};

function RenderAdjusment({
  latestQuantity,
  id,
  productQuantity,
  setProductQuantity,
}: AdjusmentProps) {
  const { cartNotifUpdate, setNewCart } = useContext(
    CartNotifContext,
  ) as CartNotifContextProps;
  const increase = () => {
    if (productQuantity >= latestQuantity) {
      setProductQuantity(productQuantity);
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
    const updated = cartNotifUpdate?.map((c) =>
      c.id === id ? { ...c, productQuantity } : c,
    );
    setNewCart(updated);
  }, [productQuantity]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={decrease} disabled={productQuantity <= 0}>
        <IndeterminateCheckBox />
      </IconButton>
      <Typography variant="body2" style={{ margin: '0 .5rem' }}>
        {productQuantity}
      </Typography>
      <IconButton onClick={increase}>
        <AddBox />
      </IconButton>
    </div>
  );
}

function Row({ item, idx }: RowProps) {
  const {
    id,
    productId,
    productCode,
    productName,
    productCategory,
    productQuantity: productIncart,
  } = item;
  const [open, setOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState(productIncart);
  const [product, setProduct] = useState<Product | null>(null);
  const handleClick = async (myProductId: string) => {
    try {
      const { data } = await axios.get(`/api/products/id/${myProductId}`);
      setProduct(data);
      setOpen(!open);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  const adjustmentProps = {
    id,
    latestQuantity: product?.latestQuantity!,
    setProductQuantity,
    productQuantity,
  };

  return (
    <>
      <TableRow sx={{ '& > *': { border: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleClick(productId)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {idx + 1}
        </TableCell>
        <TableCell align="center">{productCode}</TableCell>
        <TableCell align="center">{productCategory}</TableCell>
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
                    <TableCell component="th" scope="row" align="center">
                      {product?.code}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {product?.name}
                    </TableCell>
                    <TableCell align="center">{product?.price}</TableCell>
                    <TableCell align="center">
                      {product?.latestQuantity}
                    </TableCell>
                    <TableCell align="center">{product?.productDesc}</TableCell>
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

export default function CollapsibleTable({
  userId,
  setOpen,
  notifId,
}: TableProps) {
  const [loading, setLoading] = useState(true);
  const { cartNotifUpdate, setCartToEmpty, setCartNotifUpdate } = useContext(
    CartNotifContext,
  ) as CartNotifContextProps;
  const queryClient = useQueryClient();

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalReject, setOpenModalReject] = useState(false);

  const updateNotifMutation = useMutation(
    (value: any) => {
      return axios.post(`/api/notifs/stockin/approval/${value.id}`, {
        value: value.notifCart,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
        queryClient.invalidateQueries('products');
        queryClient.invalidateQueries('stocks');
      },
    },
  );

  const modalHandler = async () => {
    setOpenModalConfirm(true);
  };

  const handleApprove = async () => {
    const notifCart = cartNotifUpdate?.map((c) => {
      return { id: c.id, quantity: c.productQuantity };
    });
    try {
      updateNotifMutation.mutate({ id: notifId, notifCart });
    } catch (err: any) {
      throw new Error(err);
    } finally {
      setCartToEmpty([]);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!notifId) {
      setLoading(true);
      return;
    }
    const setIncart = async () => {
      const { data } = await axios.get<TIncart>(`/api/notifs/${notifId}`);

      setCartNotifUpdate((prev: NotifCart[]) =>
        prev?.length !== 0 ? prev : data.notifCarts,
      );
      setLoading(false);
    };
    setIncart();
  }, [notifId]);

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
        title="Detail Pemasukan Barang"
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
              {cartNotifUpdate?.length !== 0 &&
                cartNotifUpdate?.map((item, index) => (
                  <Row key={item.id} item={item} idx={index} />
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
        setCartNotifUpdate={setCartNotifUpdate}
        type="reject"
      />
    </Paper>
  );
}
