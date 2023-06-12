import React, { ReactNode, createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Categories } from '@/lib/types';

export interface CategoryContextProps {
  categories?: Categories[] | null;
  isSuccess?: boolean;
  isError?: boolean;
  isLoading?: boolean;
}

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryContext = createContext<CategoryContextProps | null>(null);

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const {
    data: categories,
    isSuccess,
    isError,
    isLoading,
  } = useQuery('categories', async () => {
    const { data } = await axios.get('/api/categories');
    return data;
  });

  return (
    <CategoryContext.Provider
      value={{ categories, isSuccess, isError, isLoading }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
