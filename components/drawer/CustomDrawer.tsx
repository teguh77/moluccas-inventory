import React, { useState, FC, useContext, useRef, useEffect } from 'react';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InboxIcon from '@mui/icons-material/Inbox';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MUIAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '@/contexts/auth';
import { CartContext, CartContextProps } from '@/contexts/cart';
import { NotifContext, NotifContextProps } from '@/contexts/notif';
import BottomNav from './bottomNavbar/BottomNav';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Notification from './notif';
import MenuPopper from './bottomNavbar/MenuPopper';
import GeneralModal from '../modal/GeneralModal';
import { Tooltip } from '@mui/material';

const drawerWidth = 240;

interface Props {
  window?: () => Window;
  children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomDrawer: FC<Props> = (props) => {
  const { user } = useAuthState();
  const { notifs, isSuccess } = useContext(NotifContext) as NotifContextProps;

  const router = useRouter();
  const { window, children } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const { incartTotal } = useContext(CartContext) as CartContextProps;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [errors, setErrors] = useState<any | null>(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const [anchorElPopperMobile, setAnchorElPopperMobile] = useState(null);
  const [openPopperMobile, setOpenPopperMobile] = useState(false);

  useEffect(() => {
    router.prefetch('/login');
  }, [router]);

  const popperHandlerMobile = (event: any) => {
    setAnchorElPopperMobile(event.currentTarget);
    setOpenPopperMobile((prev) => !prev);
  };
  //
  const [anchorElProfile, setAnchorElProfile] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorElProfile);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };
  const logoutHandler = () => {
    axios
      .get('/api/auth/logout')
      .then(() => {
        dispatch && dispatch('LOGOUT');
        router.push('/login');
      })
      .catch((error) => {
        if (authenticated) {
          setErrors(error.response.data);
        }
        router.push('/login');
      });
  };

  const handleMenuClose = () => {
    setAnchorElProfile(null);
  };

  const popperHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenPopper((prev) => !prev);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // BOTTOM MENU POPPER
  const [openBottomPopper, setOpenBottomPopper] = useState(false);
  const bottomPopperAnchorRef = useRef(null);

  const handleToggleBottomPopper = () => {
    setOpenBottomPopper((prevOpen) => !prevOpen);
  };

  function handleListKeyDown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenBottomPopper(false);
    }
  }

  // END BOTTOM MENU POPPER
  const popperId = openPopper ? 'notif-popper' : undefined;

  const getListStyle = (pathname: string) => {
    const isActive = router.pathname === pathname;
    return {
      cursor: 'pointer',
      color: 'white',
      height: '3rem',
      backgroundColor: '#f73379',
      borderRadius: 10,
      margin: '1rem 0',
      width: '100%',
      transision: 'all',
      transform: isActive ? 'scale(1.05)' : 'scale(0.95)',
      '&:hover': {
        transform: 'scale(1.05)',
        transition: 'transform .3s',
        backgroundColor: '#f73379',
        color: 'white',
      },
    };
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorElProfile}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id="menu-profile"
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => setOpenModalConfirm(true)}>Logout</MenuItem>
    </Menu>
  );

  const drawer = (
    <div
      style={{
        backgroundColor: '#041A4D',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='589' height='379.5' viewBox='0 0 1600 800'%3E%3Cpath fill='%23FF7' d='M1102.5 734.8c2.5-1.2 24.8-8.6 25.6-7.5.5.7-3.9 23.8-4.6 24.5C1123.3 752.1 1107.5 739.5 1102.5 734.8zM1226.3 229.1c0-.1-4.9-9.4-7-14.2-.1-.3-.3-1.1-.4-1.6-.1-.4-.3-.7-.6-.9-.3-.2-.6-.1-.8.1l-13.1 12.3c0 0 0 0 0 0-.2.2-.3.5-.4.8 0 .3 0 .7.2 1 .1.1 1.4 2.5 2.1 3.6 2.4 3.7 6.5 12.1 6.5 12.2.2.3.4.5.7.6.3 0 .5-.1.7-.3 0 0 1.8-2.5 2.7-3.6 1.5-1.6 3-3.2 4.6-4.7 1.2-1.2 1.6-1.4 2.1-1.6.5-.3 1.1-.5 2.5-1.9C1226.5 230.4 1226.6 229.6 1226.3 229.1zM33 770.3C33 770.3 33 770.3 33 770.3c0-.7-.5-1.2-1.2-1.2-.1 0-.3 0-.4.1-1.6.2-14.3.1-22.2 0-.3 0-.6.1-.9.4-.2.2-.4.5-.4.9 0 .2 0 4.9.1 5.9l.4 13.6c0 .3.2.6.4.9.2.2.5.3.8.3 0 0 .1 0 .1 0 7.3-.7 14.7-.9 22-.6.3 0 .7-.1.9-.3.2-.2.4-.6.4-.9C32.9 783.3 32.9 776.2 33 770.3z'/%3E%3Cpath fill='%235ff' d='M171.1 383.4c1.3-2.5 14.3-22 15.6-21.6.8.3 11.5 21.2 11.5 22.1C198.1 384.2 177.9 384 171.1 383.4zM596.4 711.8c-.1-.1-6.7-8.2-9.7-12.5-.2-.3-.5-1-.7-1.5-.2-.4-.4-.7-.7-.8-.3-.1-.6 0-.8.3L574 712c0 0 0 0 0 0-.2.2-.2.5-.2.9 0 .3.2.7.4.9.1.1 1.8 2.2 2.8 3.1 3.1 3.1 8.8 10.5 8.9 10.6.2.3.5.4.8.4.3 0 .5-.2.6-.5 0 0 1.2-2.8 2-4.1 1.1-1.9 2.3-3.7 3.5-5.5.9-1.4 1.3-1.7 1.7-2 .5-.4 1-.7 2.1-2.4C596.9 713.1 596.8 712.3 596.4 711.8zM727.5 179.9C727.5 179.9 727.5 179.9 727.5 179.9c.6.2 1.3-.2 1.4-.8 0-.1 0-.2 0-.4.2-1.4 2.8-12.6 4.5-19.5.1-.3 0-.6-.2-.8-.2-.3-.5-.4-.8-.5-.2 0-4.7-1.1-5.7-1.3l-13.4-2.7c-.3-.1-.7 0-.9.2-.2.2-.4.4-.5.6 0 0 0 .1 0 .1-.8 6.5-2.2 13.1-3.9 19.4-.1.3 0 .6.2.9.2.3.5.4.8.5C714.8 176.9 721.7 178.5 727.5 179.9zM728.5 178.1c-.1-.1-.2-.2-.4-.2C728.3 177.9 728.4 178 728.5 178.1z'/%3E%3Cg fill='%23FFF'%3E%3Cpath d='M699.6 472.7c-1.5 0-2.8-.8-3.5-2.3-.8-1.9 0-4.2 1.9-5 3.7-1.6 6.8-4.7 8.4-8.5 1.6-3.8 1.7-8.1.2-11.9-.3-.9-.8-1.8-1.2-2.8-.8-1.7-1.8-3.7-2.3-5.9-.9-4.1-.2-8.6 2-12.8 1.7-3.1 4.1-6.1 7.6-9.1 1.6-1.4 4-1.2 5.3.4 1.4 1.6 1.2 4-.4 5.3-2.8 2.5-4.7 4.7-5.9 7-1.4 2.6-1.9 5.3-1.3 7.6.3 1.4 1 2.8 1.7 4.3.5 1.1 1 2.2 1.5 3.3 2.1 5.6 2 12-.3 17.6-2.3 5.5-6.8 10.1-12.3 12.5C700.6 472.6 700.1 472.7 699.6 472.7zM740.4 421.4c1.5-.2 3 .5 3.8 1.9 1.1 1.8.4 4.2-1.4 5.3-3.7 2.1-6.4 5.6-7.6 9.5-1.2 4-.8 8.4 1.1 12.1.4.9 1 1.7 1.6 2.7 1 1.7 2.2 3.5 3 5.7 1.4 4 1.2 8.7-.6 13.2-1.4 3.4-3.5 6.6-6.8 10.1-1.5 1.6-3.9 1.7-5.5.2-1.6-1.4-1.7-3.9-.2-5.4 2.6-2.8 4.3-5.3 5.3-7.7 1.1-2.8 1.3-5.6.5-7.9-.5-1.3-1.3-2.7-2.2-4.1-.6-1-1.3-2.1-1.9-3.2-2.8-5.4-3.4-11.9-1.7-17.8 1.8-5.9 5.8-11 11.2-14C739.4 421.6 739.9 421.4 740.4 421.4zM261.3 590.9c5.7 6.8 9 15.7 9.4 22.4.5 7.3-2.4 16.4-10.2 20.4-3 1.5-6.7 2.2-11.2 2.2-7.9-.1-12.9-2.9-15.4-8.4-2.1-4.7-2.3-11.4 1.8-15.9 3.2-3.5 7.8-4.1 11.2-1.6 1.2.9 1.5 2.7.6 3.9-.9 1.2-2.7 1.5-3.9.6-1.8-1.3-3.6.6-3.8.8-2.4 2.6-2.1 7-.8 9.9 1.5 3.4 4.7 5 10.4 5.1 3.6 0 6.4-.5 8.6-1.6 4.7-2.4 7.7-8.6 7.2-15-.5-7.3-5.3-18.2-13-23.9-4.2-3.1-8.5-4.1-12.9-3.1-3.1.7-6.2 2.4-9.7 5-6.6 5.1-11.7 11.8-14.2 19-2.7 7.7-2.1 15.8 1.9 23.9.7 1.4.1 3.1-1.3 3.7-1.4.7-3.1.1-3.7-1.3-4.6-9.4-5.4-19.2-2.2-28.2 2.9-8.2 8.6-15.9 16.1-21.6 4.1-3.1 8-5.1 11.8-6 6-1.4 12 0 17.5 4C257.6 586.9 259.6 588.8 261.3 590.9z'/%3E%3Ccircle cx='1013.7' cy='153.9' r='7.1'/%3E%3Ccircle cx='1024.3' cy='132.1' r='7.1'/%3E%3Ccircle cx='1037.3' cy='148.9' r='7.1'/%3E%3Cpath d='M1508.7 297.2c-4.8-5.4-9.7-10.8-14.8-16.2 5.6-5.6 11.1-11.5 15.6-18.2 1.2-1.7.7-4.1-1-5.2-1.7-1.2-4.1-.7-5.2 1-4.2 6.2-9.1 11.6-14.5 16.9-4.8-5-9.7-10-14.7-14.9-1.5-1.5-3.9-1.5-5.3 0-1.5 1.5-1.5 3.9 0 5.3 4.9 4.8 9.7 9.8 14.5 14.8-1.1 1.1-2.3 2.2-3.5 3.2-4.1 3.8-8.4 7.8-12.4 12-1.4 1.5-1.4 3.8 0 5.3 0 0 0 0 0 0 1.5 1.4 3.9 1.4 5.3-.1 3.9-4 8.1-7.9 12.1-11.7 1.2-1.1 2.3-2.2 3.5-3.3 4.9 5.3 9.8 10.6 14.6 15.9.1.1.1.1.2.2 1.4 1.4 3.7 1.5 5.2.2C1510 301.2 1510.1 298.8 1508.7 297.2zM327.6 248.6l-.4-2.6c-1.5-11.1-2.2-23.2-2.3-37 0-5.5 0-11.5.2-18.5 0-.7 0-1.5 0-2.3 0-5 0-11.2 3.9-13.5 2.2-1.3 5.1-1 8.5.9 5.7 3.1 13.2 8.7 17.5 14.9 5.5 7.8 7.3 16.9 5 25.7-3.2 12.3-15 31-30 32.1L327.6 248.6zM332.1 179.2c-.2 0-.3 0-.4.1-.1.1-.7.5-1.1 2.7-.3 1.9-.3 4.2-.3 6.3 0 .8 0 1.7 0 2.4-.2 6.9-.2 12.8-.2 18.3.1 12.5.7 23.5 2 33.7 11-2.7 20.4-18.1 23-27.8 1.9-7.2.4-14.8-4.2-21.3l0 0C347 188.1 340 183 335 180.3 333.6 179.5 332.6 179.2 332.1 179.2zM516.3 60.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C517.3 60.4 516.8 60.8 516.3 60.8zM506.1 70.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C506.4 70.5 506.2 70.5 506.1 70.5zM494.1 64.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C494.7 64.3 494.4 64.4 494.1 64.4zM500.5 55.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C500.9 55.3 500.7 55.3 500.5 55.3zM506.7 55c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C507.4 54.8 507.1 55 506.7 55zM1029.3 382.8c-.1 0-.2 0-.4-.1-2.4-.7-4-.9-6.7-.7-.7 0-1.3-.5-1.4-1.2 0-.7.5-1.3 1.2-1.4 3.1-.2 4.9 0 7.6.8.7.2 1.1.9.9 1.6C1030.3 382.4 1029.8 382.8 1029.3 382.8zM1019.1 392.5c-.5 0-1-.3-1.2-.8-.8-2.1-1.2-4.3-1.3-6.6 0-.7.5-1.3 1.2-1.3.7 0 1.3.5 1.3 1.2.1 2 .5 3.9 1.1 5.8.2.7-.1 1.4-.8 1.6C1019.4 392.5 1019.2 392.5 1019.1 392.5zM1007.1 386.4c-.4 0-.8-.2-1-.5-.4-.6-.3-1.4.2-1.8 1.8-1.4 3.7-2.6 5.8-3.6.6-.3 1.4 0 1.7.6.3.6 0 1.4-.6 1.7-1.9.9-3.7 2-5.3 3.3C1007.7 386.3 1007.4 386.4 1007.1 386.4zM1013.5 377.3c-.5 0-.9-.3-1.2-.7-.5-1-1.2-1.9-2.4-3.4-.3-.4-.7-.9-1.1-1.4-.4-.6-.3-1.4.2-1.8.6-.4 1.4-.3 1.8.2.4.5.8 1 1.1 1.4 1.3 1.6 2.1 2.6 2.7 3.9.3.6 0 1.4-.6 1.7C1013.9 377.3 1013.7 377.3 1013.5 377.3zM1019.7 377c-.3 0-.5-.1-.8-.2-.6-.4-.7-1.2-.3-1.8 1.2-1.7 2.3-3.4 3.3-5.2.3-.6 1.1-.9 1.7-.5.6.3.9 1.1.5 1.7-1 1.9-2.2 3.8-3.5 5.6C1020.4 376.8 1020.1 377 1019.7 377zM1329.7 573.4c-1.4 0-2.9-.2-4.5-.7-8.4-2.7-16.6-12.7-18.7-20-.4-1.4-.7-2.9-.9-4.4-8.1 3.3-15.5 10.6-15.4 21 0 1.5-1.2 2.7-2.7 2.8 0 0 0 0 0 0-1.5 0-2.7-1.2-2.7-2.7-.1-6.7 2.4-12.9 7-18 3.6-4 8.4-7.1 13.7-8.8.5-6.5 3.1-12.9 7.4-17.4 7-7.4 18.2-8.9 27.3-10.1l.7-.1c1.5-.2 2.9.9 3.1 2.3.2 1.5-.9 2.9-2.3 3.1l-.7.1c-8.6 1.2-18.4 2.5-24 8.4-3 3.2-5 7.7-5.7 12.4 7.9-1 17.7 1.3 24.3 5.7 4.3 2.9 7.1 7.8 7.2 12.7.2 4.3-1.7 8.3-5.2 11.1C1335.2 572.4 1332.6 573.4 1329.7 573.4zM1311 546.7c.1 1.5.4 3 .8 4.4 1.7 5.8 8.7 14.2 15.1 16.3 2.8.9 5.1.5 7.2-1.1 2.7-2.1 3.2-4.8 3.1-6.6-.1-3.2-2-6.4-4.8-8.3C1326.7 547.5 1317.7 545.6 1311 546.7z'/%3E%3C/g%3E%3C/svg%3E")`, // kalo bisa diganti aja karena http
        backgroundAttachment: 'fixed',
        padding: '1.4rem',
        height: '100%',
      }}
    >
      <Toolbar />
      <Divider />
      <List sx={{ transform: 'none' }}>
        <Link href="/dashboard">
          <ListItem sx={getListStyle('/dashboard')}>
            <ListItemIcon>
              <DashboardIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </ListItem>
        </Link>
        <Link href="/">
          <ListItem sx={getListStyle('/')}>
            <ListItemIcon>
              <AllInboxIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText>Gallery</ListItemText>
          </ListItem>
        </Link>
        {user?.role !== 'USER' && (
          <Link href="/stock">
            <ListItem sx={getListStyle('/stock')}>
              <ListItemIcon>
                <FeaturedPlayListIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText>Stock</ListItemText>
            </ListItem>
          </Link>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          backgroundColor: 'white',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            display: {
              xs: 'none',
              md: 'flex',
            },
            borderBottom: '1px solid #E5E8EC',
          }}
        >
          <Typography
            variant="h5"
            noWrap
            component="div"
            color="#757575"
            style={{ width: '100%' }}
          >
            Moluccas Inventory
          </Typography>
          <Box
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              justifyContent: {
                md: 'flex-end',
              },
              width: {
                md: '100%',
              },
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Box
                style={{
                  padding: '0.3rem 1rem',
                  border: '1px solid #E5E8EC',
                  borderRadius: 5,
                  marginRight: '0.3rem',
                }}
              >
                <Typography
                  variant="caption"
                  color="primary"
                  style={{ textTransform: 'uppercase' }}
                >
                  {user?.username}
                </Typography>
              </Box>

              <Tooltip title="Akun" placement="bottom">
                <IconButton
                  style={{ margin: '0 .1rem' }}
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                >
                  <AccountCircle color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Pemberitahuan" placement="bottom">
                <IconButton
                  color="inherit"
                  onClick={popperHandler}
                  style={{ margin: '0 .1rem' }}
                >
                  {isSuccess && notifs?.length === 0 ? (
                    <NotificationsIcon color="primary" />
                  ) : (
                    <Badge badgeContent={notifs?.length} color="secondary">
                      <NotificationsIcon color="primary" />
                    </Badge>
                  )}
                </IconButton>
              </Tooltip>
              <Popper
                id={popperId}
                open={openPopper}
                anchorEl={anchorEl}
                placement="bottom-end"
                transition
                disablePortal
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper
                      style={{
                        padding: '1rem',
                        maxHeight: '22rem',
                        width: '23rem',
                        overflow: 'auto',
                      }}
                      elevation={5}
                    >
                      <Notification setOpenPopper={setOpenPopper} />
                    </Paper>
                  </Fade>
                )}
              </Popper>
              <Tooltip title="Cart" placement="bottom">
                <Link href="/cart">
                  <IconButton color="inherit">
                    {incartTotal === 0 ? (
                      <InboxIcon color="primary" />
                    ) : (
                      <Badge badgeContent={incartTotal} color="secondary">
                        <InboxIcon color="primary" />
                      </Badge>
                    )}
                  </IconButton>
                </Link>
              </Tooltip>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
          display: { md: 'none' },
        }}
      >
        <BottomNav handleToggle={handleToggleBottomPopper} notifs={notifs} />
        <MenuPopper
          notifs={notifs}
          openBottomPopper={openBottomPopper}
          handleListKeyDown={handleListKeyDown}
          bottomPopperAnchorRef={bottomPopperAnchorRef}
          popperHandler={popperHandlerMobile}
          handleProfileMenuOpen={handleProfileMenuOpen}
        />
        <Popper
          style={{
            position: 'fixed',
            marginBottom: '1.8rem',
            marginRight: '.5rem',
          }}
          open={openPopperMobile}
          anchorEl={anchorElPopperMobile}
          transition
          placement="left"
          disablePortal
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper
                style={{
                  padding: '1rem',
                  maxHeight: '22rem',
                  width: '21rem',
                  overflow: 'auto',
                }}
              >
                <Notification setOpenPopper={setOpenPopperMobile} />
              </Paper>
            </Fade>
          )}
        </Popper>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          padding: '2rem',
          flexGrow: 1,
          minHeight: '100vh',
          overflow: 'auto',
          background:
            'radial-gradient(circle, rgba(226,226,226,0.43666434356) 0%, rgba(255,255,255,0.5) 100%)',
        }}
      >
        <Toolbar />
        <main>{children}</main>
      </Box>
      {renderMenu}
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
      <GeneralModal
        handler={logoutHandler}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah anda yakin untuk keluar ?"
        type="confirm"
      />
    </Box>
  );
};
export default CustomDrawer;
