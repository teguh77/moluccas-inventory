import { ChildrenProps, NotifCart } from '@/lib/types';
import React, {
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from 'react';

export interface CartNotifContextProps {
  cartNotifUpdate: NotifCart[] | null;
  setCartNotifUpdate: Dispatch<any>;
  setNewCart: Dispatch<SetStateAction<any>>;
  setCartToEmpty: Dispatch<SetStateAction<any>>;
}

export const CartNotifContext = createContext<CartNotifContextProps | null>(
  null,
);

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

export const CartNotifProvider = ({ children }: ChildrenProps) => {
  const [cartNotifUpdate, setCartNotifUpdate] = useState(() =>
    getLocalStorage('notif-cart', []),
  );

  useEffect(() => {
    setLocalStorage('notif-cart', cartNotifUpdate);
  }, [cartNotifUpdate]);

  return (
    <CartNotifContext.Provider
      value={{
        cartNotifUpdate,
        setCartNotifUpdate,
        setNewCart: (newCart: any) => setCartNotifUpdate(newCart),
        setCartToEmpty: () => setCartNotifUpdate([]),
      }}
    >
      {children}
    </CartNotifContext.Provider>
  );
};
