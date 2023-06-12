import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).get(async (_, res) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    const fixStocks = stocks.map((stock) => {
      return {
        id: stock.id,
        name: stock.product.name,
        code: stock.product.code,
        category: stock.product.category.title,
        price: stock.price,
        quantity: stock.quantity,
        stockDesc: stock.description,
        productDesc: stock.product.description,
        createdAt: stock.createdAt,
      };
    });
    return res.json(fixStocks);
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
