import React, { createContext, useState } from 'react';
import { ChildrenProps, Notif } from '@/lib/types';

export interface RefetchProps {
  status: boolean;
  setStatus: (value: boolean) => void;
}

export const RefetchContext = createContext<RefetchProps | null>(null);

export const RefetchProvider = ({ children }: ChildrenProps) => {
  const [status, setStatus] = useState(false);
  return (
    <RefetchContext.Provider value={{ status, setStatus }}>
      {children}
    </RefetchContext.Provider>
  );
};
