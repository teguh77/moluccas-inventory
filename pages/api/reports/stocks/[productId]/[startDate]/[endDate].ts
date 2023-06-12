import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).get(async (req, res) => {
  const { productId, startDate, endDate } = req.query;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId as string,
      },
      select: {
        code: true,
        name: true,
        category: {
          select: {
            title: true,
          },
        },
        description: true,
      },
    });
    const stocksInBeforeDate = await prisma.stockIn.findMany({
      where: {
        productId: productId as string,
        createdAt: {
          lt: new Date(startDate as string),
        },
      },
      select: {
        quantity: true,
      },
    });
    const stocksOutBeforeDate = await prisma.stockOut.findMany({
      where: {
        productId: productId as string,
        createdAt: {
          lt: new Date(startDate as string),
        },
      },
      select: {
        quantity: true,
      },
    });
    const stocksInRangeDate = await prisma.stockIn.findMany({
      where: {
        productId: productId as string,
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      select: {
        id: true,
        price: true,
        quantity: true,
        createdAt: true,
        description: true,
      },
    });
    const stocksOutRangeDate = await prisma.stockOut.findMany({
      where: {
        productId: productId as string,
        createdAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      select: {
        id: true,
        price: true,
        quantity: true,
        createdAt: true,
        description: true,
      },
    });

    const stockInQuantity = stocksInRangeDate.reduce(
      (acc, { quantity }: { quantity: number }) => acc + quantity,
      0,
    );
    const stockOutQuantity = stocksOutRangeDate.reduce(
      (acc, { quantity }: { quantity: number }) => acc + quantity,
      0,
    );
    const stockInMain = stocksInBeforeDate.reduce(
      (acc, { quantity }: { quantity: number }) => acc + quantity,
      0,
    );
    const stockOutMain = stocksOutBeforeDate.reduce(
      (acc, { quantity }: { quantity: number }) => acc + quantity,
      0,
    );

    const stockIn = stocksInRangeDate.map((s) => {
      return {
        id: s.id,
        quantity: s.quantity,
        description: s.description,
        price: s.price,
        date: s.createdAt,
        ket: 'Pemasukan',
      };
    });
    const stockOut = stocksOutRangeDate.map((s) => {
      return {
        id: s.id,
        quantity: s.quantity,
        description: s.description,
        price: s.price,
        date: s.createdAt,
        ket: 'Pengeluaran',
      };
    });
    return res.json({
      data: {
        name: product?.name,
        code: product?.code,
        category: product?.category.title,
        description: product?.description,
        mutations: stockIn
          .concat(stockOut)
          .sort((a, b) => a.date.valueOf() - b.date.valueOf()),
      },
      mainStock: stockInMain - stockOutMain,
      latestStock:
        stockInMain - stockOutMain + stockInQuantity - stockOutQuantity,
    });
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
