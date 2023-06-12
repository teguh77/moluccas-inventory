import React, { ReactNode, createContext } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Product } from '@/lib/types';

export interface ProductContextProps {
  products: Product[] | [];
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
}

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductContext = createContext<ProductContextProps | null>(null);

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const {
    data: products,
    isSuccess,
    isError,
    isLoading,
  } = useQuery('products', async () => {
    const { data } = await axios.get('/api/products');
    return data;
  });

  return (
    <ProductContext.Provider
      value={{ products, isSuccess, isError, isLoading }}
    >
      {children}
    </ProductContext.Provider>
  );
};
