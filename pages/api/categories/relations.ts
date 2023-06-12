import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).get(async (_, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          include: {
            stocks: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });
    return res.json(categories);
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
