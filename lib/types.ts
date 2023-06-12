import { IncartDetail } from '@prisma/client';
import { NextApiRequest } from 'next';
import { ReactNode } from 'react';

/* eslint-disable no-unused-vars */
export interface Properties {
  image: string;
  color: string;
}

export interface Categories {
  id: string;
  title: string;
  products: Product[];
  createdAt: Date;
}

export interface Order {
  id: string;
  carts: CartOfficial[];
  user: User;
  userId: string;
  deliveryNote: any;
}

export interface CartOfficial {
  id: string;
  productName: string;
  productCategory: string;
  productQuantity: number;
  productCode: string;
  order: Order;
  orderId: string;
  createdAt: string;
}

export interface Stock {
  id: string;
  description?: string;
  price: number;
  quantity: number;
  product: Product;
  createdAt: Date;
}

export interface Incart {
  products: IncartDetail[];
  user: User;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  productDesc?: string;
  stockDesc?: string;
  latestQuantity: number;
  price: number;
  date: Date;
  value: number;
}

export type User = {
  id: string;
  username: string;
  password?: string;
  fullname: string;
  role: string;
};

export type Notif = {
  id: string;
  status: string;
  type: string;
  note: string;
  description: string;
  user: User;
  userId: string;
  notifCarts: NotifCart[];
};

export type NotifCart = {
  id: string;
  productName: string;
  productCategory: string;
  productQuantity: number;
  productCode: string;
  description: string;
  price: number;
  productId: string;
  notif: Notif;
  notifId: string;
  createdAt: string;
};

export enum ERule {
  ALLOW = 'ALLOW',
  PREVENT = 'PREVENT',
}
export enum ERole {
  KSBU = 'KSBU',
  USER = 'USER',
  RT = 'RT',
}

export enum EStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  NOTHING = 'NOTHING ',
  READY = 'READY ',
  INSTRUCTION = 'INSTRUCTION ',
  PURE = 'PURE ',
  KSBU = 'KSBU',
}

export type Cart = {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  incart: number;
};

export type CartContextType = {
  skip: [Set<number>, React.Dispatch<React.SetStateAction<Set<number>>>];
  cart: Cart[];
  incartTotal: number;
  setNewCart: (newCart: Cart[]) => void;
  setCartProduct: (product: Cart) => void;
  setCartToEmpty: () => void;
};

export type Rule = {
  id: string;
  allowAddToCart: string;
  activeStep: number;
  user: User;
  userId: string;
};

export type ChildrenProps = {
  children: ReactNode;
};

export type TStock = {
  stockOut: TStockOut[];
  stockOutTotal: number;
  productTotal: number;
  categoryTotal: number;
};

export type TStockOut = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  genuineQuantity: number;
  createdAt: string;
  otherQuantity: number;
};

export interface NextApiRequestExtended extends NextApiRequest {
  user: {
    userId: string | null;
    username: string | null;
    fullname: string | null;
    role: string | null;
  };
}
