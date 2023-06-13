import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).get(async (req, res) => {
  const { id } = req.query;
  try {
    const notif = await prisma.notif.findUnique({
      where: {
        id: id as string,
      },
      select: {
        id: true,
        user: true,
        notifCarts: true,
      },
    });
    return res.json(notif);
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
