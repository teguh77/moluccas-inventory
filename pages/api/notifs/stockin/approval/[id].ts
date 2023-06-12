import { getMonth } from 'date-fns';
import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

const monthName = [
  'jan',
  'feb',
  'mar',
  'apr',
  'mei',
  'jun',
  'jul',
  'agu',
  'sep',
  'okt',
  'nov',
  'des',
];

type NotifCart = {
  id: string;
  quantity: number;
};

router.use(auth).post(async (req, res) => {
  const { id } = req.query;
  const { value: notifCarts }: { value: NotifCart[] } = req.body;
  const { role } = req.user;

  try {
    if (role !== 'KSBU') {
      throw new Error('FORBIDDEN');
    }

    notifCarts?.forEach(async (nc) => {
      const realNc = await prisma.notifCart.findUnique({
        where: {
          id: nc.id,
        },
      });

      const createdStock = await prisma.stock.create({
        data: {
          description: realNc?.description || null,
          price: realNc?.price as number,
          productId: realNc?.productId as string,
          quantity: nc.quantity,
        },
      });

      if (createdStock) {
        const product = await prisma.product.findUnique({
          where: { id: realNc?.productId as string },
          include: { stocks: true },
        });
        const latestQuantity = Array.from(
          product?.stocks || [],
          (q) => q.quantity,
        ).reduce((acc, a) => acc + a);
        await prisma.product.update({
          where: {
            id: realNc?.productId as string,
          },
          data: {
            latestQuantity,
          },
        });
        const stock = await prisma.stock.findUnique({
          where: { id: createdStock.id },
          select: {
            price: true,
            quantity: true,
            description: true,
            product: {
              select: {
                id: true,
                name: true,
                code: true,
                category: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        });
        await prisma.stockIn.create({
          data: {
            productId: stock?.product.id,
            price: stock?.price as number,
            quantity: stock?.quantity as number,
            description: stock?.description,
            category: stock?.product.category.title,
            createdMonth: monthName[getMonth(new Date())],
          },
        });
      }
    });

    await prisma.notif.update({
      where: {
        id: id as string,
      },
      data: {
        status: 'APPROVED',
        description: 'KSBU Telah Menyetujui Pemasukan Barang',
      },
    });
    return res.json({ message: 'Notif updated' });
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
