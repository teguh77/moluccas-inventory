import React, { createContext, ReactNode } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Rule } from '@/lib/types';

export interface RuleContextProps {
  rules?: Rule | null;
  isSuccess?: boolean;
  isError?: boolean;
  isLoading?: boolean;
}

export const RuleContext = createContext<RuleContextProps | null | undefined>(
  null,
);

interface RuleProviderProps {
  children: ReactNode;
}

export const RuleProvider: React.FC<RuleProviderProps> = ({ children }) => {
  const {
    data: rules,
    isSuccess,
    isError,
    isLoading,
  } = useQuery<Rule>('rules', async () => {
    const { data } = await axios.get<Rule>('/api/rules');
    return data;
  });

  return (
    <RuleContext.Provider value={{ rules, isSuccess, isError, isLoading }}>
      {children}
    </RuleContext.Provider>
  );
};
