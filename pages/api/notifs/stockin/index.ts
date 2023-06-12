import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).post(async (req, res) => {
  const { quantity, productId, description, price } = req.body;
  const { userId, role } = req.user;
  try {
    if (role === 'USER') {
      throw new Error('FORBIDDEN');
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
      },
    });

    const alreadyNotif = await prisma.notif.findFirst({
      where: {
        userId,
        type: 'STOCKIN',
      },
    });

    if (alreadyNotif) {
      await prisma.notifCart.create({
        data: {
          productId: product?.id,
          productCode: product?.code as string,
          productName: product?.name as string,
          productCategory: product?.category.title as string,
          productQuantity: quantity,
          description,
          price,
          notifId: (await alreadyNotif).id,
        },
      });
    } else {
      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'STOCKIN',
          description: 'Permohonan Penambahan Stok',
        },
      });

      await prisma.notifCart.create({
        data: {
          productId: product?.id,
          productCode: product?.code as string,
          productName: product?.name as string,
          productCategory: product?.category.title as string,
          productQuantity: quantity,
          description,
          price,
          notifId: (await notif).id,
        },
      });
    }

    return res.json({ message: 'Notif stockin created' });
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
