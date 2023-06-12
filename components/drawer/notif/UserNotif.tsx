import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircle from '@mui/icons-material/CheckCircle';
import NotificationImportant from '@mui/icons-material/NotificationImportant';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import Link from 'next/link';
import { useMutation, useQueryClient } from 'react-query';
import { Notif, User } from '@/lib/types';
import { IncartDetail } from '.prisma/client';
// dynamic
import Loading from '@/components/Loading';
import NotifDetail from './NotifDetail';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

type Props = {
  notif: Notif;
  isSuccess: boolean;
};

type Incart = {
  user: User;
  products: IncartDetail[];
};

const UserNotif = ({ notif, isSuccess }: Props) => {
  const queryClient = useQueryClient();
  const { status, id: notifId, userId, user: notifUser, description } = notif;
  const [loading, setLoading] = useState(true);
  const [incart, setIncart] = useState<Incart | null>(null);

  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(true);
      return;
    }
    const setMyIncart = async () => {
      const { data } = await axios.get(`/api/incarts/${userId}`);
      setIncart(data);
      setLoading(false);
    };
    setMyIncart();
  }, [userId]);

  const deleteNotifMutation = useMutation(
    (id) => {
      return axios.delete(`/api/notifs/stockout/rejection/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
      },
    },
  );

  const deleteNotification = async () => {
    deleteNotifMutation.mutate(notifId as any);
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          width: { xs: '17rem', md: '20rem' },
          padding: '1rem 0',
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              style={{
                backgroundColor: 'white',
                border: `1px solid ${
                  status === 'READY' || status === 'APPROVED'
                    ? '#041A4D'
                    : '#f50057'
                }`,
              }}
            >
              {status === 'READY' || status === 'APPROVED' ? (
                <CheckCircle color="primary" />
              ) : (
                <NotificationImportant color="secondary" />
              )}
            </Avatar>
          }
          title={description}
          subheader={notifUser?.fullname}
        />
        <CardActions style={{ justifyContent: 'flex-end', display: 'flex' }}>
          {status === 'REJECTED' && (
            <IconButton onClick={deleteNotification}>
              <DeleteIcon color="secondary" />
            </IconButton>
          )}
          <Button
            size="small"
            color={
              status === 'READY' || status === 'APPROVED'
                ? 'primary'
                : 'secondary'
            }
            onClick={() => setOpenDetail(true)}
          >
            Detail
          </Button>
          {status === 'READY' && (
            <Link href="/cart">
              <Button size="small" color="primary">
                Go to cart
              </Button>
            </Link>
          )}
        </CardActions>
      </Card>
      <Divider />
      {!isSuccess || loading || !incart ? (
        <Loading />
      ) : (
        <Dialog fullWidth open={openDetail} scroll="body" maxWidth="xs">
          <DialogContent style={{ padding: 0, width: '100%' }}>
            <NotifDetail
              notif={notif}
              setOpenDetail={setOpenDetail}
              incart={incart}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserNotif;
