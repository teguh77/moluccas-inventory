import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

interface Product {
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

interface ProductReport {
  products: Product[];
  totalValue: number;
}

router.use(auth).get(async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      select: {
        id: true,
        name: true,
        code: true,
        latestQuantity: true,
        description: true,
        createdAt: true,
        category: {
          select: {
            title: true,
          },
        },
        stocks: {
          select: {
            createdAt: true,
            price: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const customProduct = products.map((product) => {
      const latestProduct =
        product.stocks.length === 0
          ? null
          : product.stocks.reduce((a, b) =>
              a.createdAt > b.createdAt ? a : b,
            );

      const prod: Product = {
        id: product.id,
        name: product.name,
        code: product.code,
        category: product.category.title,
        productDesc: product.description as string,
        stockDesc: latestProduct
          ? (latestProduct.description as string)
          : product.description || '',
        latestQuantity: product.latestQuantity,
        price: latestProduct ? latestProduct.price : 0,
        date: latestProduct
          ? latestProduct.createdAt
          : product.createdAt || new Date(),
        value: latestProduct ? latestProduct.price * product.latestQuantity : 0,
      };
      return prod;
    });
    const report: ProductReport = {
      products: customProduct,
      totalValue: customProduct.reduce((acc, b) => acc + b.value, 0),
    };
    return res.json(report);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
