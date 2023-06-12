import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();
router.use(auth).get(async (_, res) => {
  try {
    const stockOutByMonth = await prisma.stockOut.groupBy({
      by: ['createdMonth'],
      _sum: {
        quantity: true,
      },
    });

    const stockOutByCategory = await prisma.stockOut.groupBy({
      by: ['category'],
      _sum: {
        quantity: true,
      },
    });
    return res.json({
      stockOutByMonth,
      stockOutByCategory,
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
