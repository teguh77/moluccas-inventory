import React, { useContext, useState, useEffect } from 'react';
import AllInbox from '@mui/icons-material/AllInbox';
import Dashboard from '@mui/icons-material/Dashboard';
import FeaturedPlayList from '@mui/icons-material/FeaturedPlayList';
import MoreVert from '@mui/icons-material/MoreVert';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useRouter } from 'next/router';
import { CartContext, CartContextProps } from '@/contexts/cart';
import { Notif } from '@/lib/types';

type Props = {
  notifs: Notif[];
  handleToggle: (value: any) => void;
};

const BottomNav = ({ handleToggle, notifs }: Props) => {
  const router = useRouter();
  const { cart } = useContext(CartContext) as CartContextProps;
  const [value, setValue] = useState('recents');
  const [changeColor, setChangeColor] = useState(false);

  useEffect(() => {
    if (cart?.length !== 0 || (notifs && notifs?.length !== 0)) {
      setChangeColor(true);
    }
  }, [cart, notifs]);

  const handleChange = (_event: any, newValue: string) => {
    setValue(newValue);
  };
  const onLink = (url: string) => {
    router.push(url);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      style={{ width: '100%' }}
    >
      <BottomNavigationAction
        label="Dashboard"
        value="dashboard"
        icon={<Dashboard />}
        onClick={() => onLink('/dashboard')}
      />
      <BottomNavigationAction
        label="Gallery"
        value="gallery"
        icon={<AllInbox />}
        onClick={() => onLink('/')}
      />
      <BottomNavigationAction
        label="Stock"
        value="stock"
        icon={<FeaturedPlayList />}
        onClick={() => onLink('/stock')}
      />
      <BottomNavigationAction
        label="More"
        value="more"
        sx={{ color: changeColor ? '#f50057' : '' }}
        icon={<MoreVert />}
        onClick={handleToggle}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
