import React, { useContext, useState } from 'react';
import Close from '@mui/icons-material/Close';
import Person from '@mui/icons-material/Person';
import SpeakerNotes from '@mui/icons-material/SpeakerNotes';
import ViewList from '@mui/icons-material/ViewList';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useAuthState } from '@/contexts/auth';
import { CartContext, CartContextProps } from '@/contexts/cart';
import { RuleContext, RuleContextProps } from '@/contexts/rule';
import { Notif, User } from '@/lib/types';
import { IncartDetail } from '.prisma/client';

import GeneralModal from '@/components/modal/GeneralModal';

type Rule = {
  activeStep?: number;
  allowAddToCart?: string;
  userId?: any;
};

type NotifProps = {
  notif: Notif;
  incart: {
    user: User;
    products: IncartDetail[];
  };
  setOpenDetail: (value: boolean) => void;
};

type Props = {
  status: string;
  user: User;
};
const RenderAlert = ({ status, user }: Props) => {
  return (
    <Alert
      severity={`${status === 'REJECTED' ? 'error' : 'success'}`}
      style={{ width: '100%' }}
      variant="filled"
    >
      {status === 'REJECTED'
        ? user.role === 'RT'
          ? 'Permohonan telah ditolak KSBU'
          : 'Permohonan anda ditolak.'
        : user.role === 'RT'
        ? 'Permohonan telah disetujui KSBU'
        : 'Permohonan anda disetujui.'}
    </Alert>
  );
};

const NotifDetail = ({ setOpenDetail, notif, incart }: NotifProps) => {
  const { user } = useAuthState();
  const { note, status, user: notifUser, type }: Notif = notif;
  const { rules } = useContext(RuleContext) as RuleContextProps;
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const { skip } = useContext(CartContext) as CartContextProps;
  const [skipped, setSkipped] = skip;
  const queryClient = useQueryClient();

  const setActiveMutation = useMutation(
    (data: Rule) => {
      return axios.patch('/api/rules', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    },
  );
  const updateNotifMutation = useMutation(
    (id) => {
      return axios.patch(`/api/notifs/stockout/approval/${id}`, {
        status: 'READY',
        description: 'Barang Sudah Siap',
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
      },
    },
  );

  const isStepSkipped = (step: any) => {
    return skipped.has(step);
  };

  const setActiveStep = async (value: number, incartUserId: string) => {
    setActiveMutation.mutate({ activeStep: value, userId: incartUserId });
  };

  const setToReady = () => {
    let newSkipped = skipped;
    if (isStepSkipped(rules?.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(rules?.activeStep);
    }
    setActiveStep(3, incart.user?.id)
      .then(() => {
        updateNotifMutation.mutate(notif.id as any);
        setSkipped(newSkipped);
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => setOpenDetail(false));
  };

  return (
    <Card
      style={{
        maxWidth: '28rem',
        minWidth: '25rem',
        maxHeight: '37rem',
        overflow: 'auto',
        padding: '0.5rem',
      }}
    >
      <CardContent>
        <CardHeader
          style={{ padding: 0 }}
          avatar={
            <Avatar
              aria-label="recipe"
              style={{ backgroundColor: 'white', border: '1px solid #041A4D' }}
            >
              <Person color="primary" />
            </Avatar>
          }
          title="Identitas Pemohon"
          action={
            <IconButton onClick={() => setOpenDetail(false)}>
              <Close color="secondary" />
            </IconButton>
          }
        />

        <Grid container spacing={2} style={{ margin: '1rem 0' }}>
          <Grid
            item
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            xs={3}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Seksi</Typography>
              <span>:</span>
            </div>
          </Grid>
          <Grid
            item
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            xs={9}
          >
            <Typography>{notifUser.fullname}</Typography>
          </Grid>
        </Grid>
        {status === 'REJECTED' && (
          <>
            <Divider style={{ marginBottom: '1rem' }} />
            <CardHeader
              style={{ padding: 0 }}
              avatar={
                <Avatar
                  aria-label="recipe"
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #041A4D',
                  }}
                >
                  <SpeakerNotes color="primary" />
                </Avatar>
              }
              title="Alasan Penolakan"
            />
            <Grid container spacing={2} style={{ margin: '1rem 0' }}>
              <Grid
                item
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
                xs={3}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>Catatan</Typography>
                  <span>:</span>
                </div>
              </Grid>
              <Grid
                item
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
                xs={9}
              >
                <Typography>{note}</Typography>
              </Grid>
            </Grid>
          </>
        )}
        <Divider style={{ marginBottom: '1rem' }} />
        <CardHeader
          style={{ padding: 0 }}
          avatar={
            <Avatar
              aria-label="recipe"
              style={{ backgroundColor: 'white', border: '1px solid #041A4D' }}
            >
              <ViewList color="primary" />
            </Avatar>
          }
          title="Daftar Barang"
        />

        <TableContainer component={Paper} style={{ margin: '1rem 0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama Barang</TableCell>
                <TableCell align="right">Jumlah</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {type === 'STOCKIN'
                ? incart?.products.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {item.productName}
                      </TableCell>
                      <TableCell align="right">
                        {item.productQuantity}
                      </TableCell>
                    </TableRow>
                  ))
                : incart.products?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {item.productName}
                      </TableCell>
                      <TableCell align="right">{item.productIncart}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 1rem 1rem',
        }}
      >
        {user && <RenderAlert status={status} user={user} />}
        {user?.role === 'RT' &&
          status !== 'READY' &&
          status !== 'REJECTED' &&
          type === 'STOCKOUT' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
                width: '100%',
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenModalConfirm(true)}
                disabled={status === 'READY'}
              >
                Barang su Siap ?
              </Button>
            </div>
          )}
      </CardActions>
      <GeneralModal
        handler={setToReady}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah anda yakin barang sudah siap ?."
        type="confirm"
      />
    </Card>
  );
};

export default NotifDetail;
