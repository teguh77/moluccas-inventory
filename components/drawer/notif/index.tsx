import React, { useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useAuthState } from '@/contexts/auth';
import { NotifContext, NotifContextProps } from '@/contexts/notif';
import { Notif } from '@/lib/types';

import Loading from '@/components/Loading';
import AdminNotif from './AdminNotif';
import StockinNotif from './StockinNotif';
import UserNotif from './UserNotif';

type Props = {
  setOpenPopper: (value: boolean) => void;
};

const Notification = ({ setOpenPopper }: Props) => {
  const { notifs, isSuccess, isLoading } = useContext(
    NotifContext,
  ) as NotifContextProps;

  const { user } = useAuthState();
  function RenderNotif(notif: Notif) {
    if (user?.role === 'KSBU') {
      if (notif.status !== 'NOTHING') {
        return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
      }
      return <AdminNotif key={notif.id} notif={notif} />;
    }
    if (user?.role === 'RT') {
      if (notif?.type === 'STOCKIN') {
        return (
          <StockinNotif key={notif.id} notif={notif} isSuccess={isSuccess} />
        );
      }
      return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
    }
    return <UserNotif key={notif.id} notif={notif} isSuccess={isSuccess} />;
  }

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {notifs?.length !== 0 ? (
            <div>{notifs?.map((notif) => RenderNotif(notif))}</div>
          ) : (
            <div
              style={{
                height: '15rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #041A4D',
                    }}
                  >
                    <InfoIcon color="primary" />
                  </Avatar>
                }
                title="Tidak ada pemberitahuan"
              />
            </div>
          )}
          <CardActions
            style={{
              justifyContent: 'flex-end',
              display: 'flex',
              marginTop: '0.5rem',
            }}
          >
            <Button
              onClick={() => setOpenPopper(false)}
              size="small"
              color="secondary"
              variant="contained"
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </CardActions>
        </div>
      )}
    </>
  );
};

export default Notification;
