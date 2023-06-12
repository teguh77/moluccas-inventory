import { startOfYear, endOfYear } from 'date-fns';
import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).get(async (req, res) => {
  const { year } = req.query;
  try {
    const stockInByMonth = await prisma.stockIn.groupBy({
      by: ['createdMonth'],
      _sum: {
        quantity: true,
      },
      where: {
        createdAt: {
          gte: startOfYear(new Date(year as string)),
          lte: endOfYear(new Date(year as string)),
        },
      },
    });

    const stockInByCategory = await prisma.stockIn.groupBy({
      by: ['category'],
      _sum: {
        quantity: true,
      },
      where: {
        createdAt: {
          gte: startOfYear(new Date(year as string)),
          lte: endOfYear(new Date(year as string)),
        },
      },
    });
    return res.json({
      stockInByMonth,
      stockInByCategory,
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
