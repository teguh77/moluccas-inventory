import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

interface Incart {
  product: {
    productId: string | null;
    quantity: number | null;
    note: string | null;
  };
}

router
  .use(auth)
  .post(async (req, res) => {
    const { product }: Incart = req.body;
    const { userId } = req.user;
    try {
      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'ADJUSTMENT',
        },
      });
      await prisma.adjustment.create({
        data: {
          productId: product.productId,
          adjustQuantity: product.quantity as number,
          note: product.note || null,
          notifId: (await notif).id,
        },
      });

      return res.json({ message: 'Notif created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (_, res) => {
    try {
      const adjust = await prisma.adjustment.findMany();
      return res.json(adjust);
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
