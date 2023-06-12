import React, { createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { ChildrenProps, Notif } from '@/lib/types';

export interface NotifContextProps {
  notifs: Notif[] | [];
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}

export const NotifContext = createContext<NotifContextProps | null>(null);

export const NotifProvider = ({ children }: ChildrenProps) => {
  const {
    data: notifs,
    isSuccess,
    isError,
    isLoading,
  } = useQuery('notifs', async () => {
    const { data } = await axios.get('/api/notifs');
    return data;
  });

  return (
    <NotifContext.Provider value={{ notifs, isSuccess, isError, isLoading }}>
      {children}
    </NotifContext.Provider>
  );
};
