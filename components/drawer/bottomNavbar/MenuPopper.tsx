import React, { useContext } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Inbox from '@mui/icons-material/Inbox';
import Notifications from '@mui/icons-material/Notifications';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Link from 'next/link';
import { CartContext, CartContextProps } from '@/contexts/cart';
import { Notif } from '@/lib/types';

type Props = {
  openBottomPopper: boolean;
  handleListKeyDown: (event: any) => void;
  bottomPopperAnchorRef: any;
  popperHandler: (event: any) => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  notifs: Notif[];
};
const MenuPopper = ({
  openBottomPopper,
  handleListKeyDown,
  bottomPopperAnchorRef,
  popperHandler,
  handleProfileMenuOpen,
  notifs,
}: Props) => {
  const { cart } = useContext(CartContext) as CartContextProps;
  return (
    <Popper
      style={{
        position: 'fixed',
        bottom: '4rem',
        right: '1.2rem',
        top: 'auto',
        left: 'auto',
      }}
      placement="top"
      open={openBottomPopper}
      anchorEl={bottomPopperAnchorRef.current}
      role={undefined}
      transition
      disablePortal
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Paper>
            <MenuList
              autoFocusItem={openBottomPopper}
              id="menu-list-grow"
              onKeyDown={handleListKeyDown}
            >
              <MenuItem onClick={popperHandler}>
                <IconButton
                  aria-label="show 11 new notifications"
                  color="inherit"
                >
                  <Badge
                    badgeContent={notifs && notifs?.length}
                    color="secondary"
                  >
                    <Notifications color="primary" />
                  </Badge>
                </IconButton>
              </MenuItem>
              <Link href="/cart">
                <MenuItem>
                  <IconButton aria-label="show 4 new mails" color="inherit">
                    {cart?.length <= 0 ? (
                      <Inbox color="primary" />
                    ) : (
                      <Badge badgeContent={cart?.length} color="secondary">
                        <Inbox color="primary" />
                      </Badge>
                    )}
                  </IconButton>
                </MenuItem>
              </Link>
              <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle color="primary" />
                </IconButton>
              </MenuItem>
            </MenuList>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default MenuPopper;
