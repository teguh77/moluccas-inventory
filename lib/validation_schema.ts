import { object, string, number, InferType, array, mixed } from 'yup';

// ---USER---
export const registerSchema = object({
  username: string().required().min(2, 'Username minimal 2 karakter'),
  password: string().required().min(2, 'Password minimal 2 karakter'), // TODO : change minimal password length
  fullname: string().required().min(2, 'Fullname minimal 2 karakter'),
  role: string().optional(),
});

export type Register = InferType<typeof registerSchema>;

export const loginSchema = object({
  username: string().required().min(2, 'Username minimal 2 karakter'),
  password: string().required().min(2, 'Password minimal 2 karakter'),
});

export type Login = InferType<typeof loginSchema>;
// ---END USER---

// ---PRODUCT---
export const categorySchema = object({
  title: string().required().min(2, 'Nama kategori minimal 2 karakter'),
});
export const productSchema = object({
  code: string().required().min(2, 'Kode minimal 2 karakter'),
  name: string().required().min(2, 'Nama minimal 2 karakter'),
  description: string().optional(),
  categoryId: string().optional(),
});

export const stockSchema = object({
  productId: string().required().min(2, 'ProductId minimal 2 karakter'),
  description: string().optional(),
  price: number().required('Harga harus diisi'),
  quantity: number().required('Jumlah harus diisi'),
});

export const stockInSchema = object({
  productCode: string().required().min(2, 'Kode minimal 2 karakter'),
  description: string().optional(),
  price: number().required('Harga harus diisi'),
  quantity: number().required('Jumlah harus diisi'),
});

export const stockOutSchema = object({
  productCode: string().required().min(2, 'Kode minimal 2 karakter'),
  description: string().optional(),
  price: number().required('Harga harus diisi'),
  quantity: number().required('Jumlah harus diisi'),
  note: string().optional(),
});

export type Category = InferType<typeof categorySchema>;
export type Product = InferType<typeof productSchema>;
export type Stock = InferType<typeof stockSchema>;
export type StockIn = InferType<typeof stockInSchema>;
export type StockOut = InferType<typeof stockOutSchema>;

// ---END PRODUCT---

// ---INCART---
export const incartSchema = object({
  stocks: array().of(
    object().shape({
      stockId: string().required().min(5, 'stockId minimal 5 karakter'),
      quantity: number().required(),
    }),
  ),
});

export const incartDetailSchema = object({
  productId: string().required().min(5, 'productId minimal 5 karakter'),
  quantity: number().required('Jumlah harus diisi'),
  incartId: string().required().min(5, 'incartId minimal 5 karakter'),
});

export type Incart = InferType<typeof incartSchema>;
export type IncartDetail = InferType<typeof incartDetailSchema>;
// ---END INCART---

// ---END INCART---
export const ruleSchema = object({
  allowAddToCart: mixed().oneOf(['ALLOW', 'PREVENT']).notRequired(),
  activeStep: number().optional().notRequired(),
  userId: string().optional().notRequired(),
});
export type Rule = InferType<typeof ruleSchema>;
// ---END INCART---

// ---ORDER---
export const orderSchema = object({
  userId: string().required().min(5, 'userId minimal 5 karakter'),
});
export type Order = InferType<typeof orderSchema>;

// ---END ORDER---

// ---CART---
export const cartSchema = object({
  productName: string().required().min(2, 'Nama minimal 2 karakter'),
  productCategory: string().required().min(2, 'Kategori minimal 2 karakter'),
  productQuantity: number().required('Jumlah harus diisi lengkap'),
  orderId: string().required().min(5, 'userId minimal 5 karakter'),
  notifId: string().required().min(5, 'notifId minimal 5 karakter'),
});

export type Cart = InferType<typeof cartSchema>;
// ---END CART---

// ---NOTIF---
export const notifSchema = object({
  status: string().required().min(8, 'Kode minimal 8 karakter'),
  note: string().optional(),
  userId: string().required().min(5, 'userId minimal 5 karakter'),
});
export type Notif = InferType<typeof notifSchema>;

// ---END NOTIF---

// ---PROPOSAL---
export const proposalSchema = object({
  productName: string().required().min(2, 'productName minimal 2 karakter'),
  description: string().optional(),
  quantity: number().required('Jumlah harus diisi lengkap'),
  userId: string().optional(),
  whenNeeded: string().optional(),
});
export type Proposal = InferType<typeof proposalSchema>;
// ---END PROPOSAL---
