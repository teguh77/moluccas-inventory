import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';

import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

const updateLatestQuantity = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { stocks: true },
  });
  const latestQuantity = await Array.from(
    product?.stocks || [],
    (q) => q.quantity,
  ).reduce((acc, a) => acc + a);
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      latestQuantity,
    },
  });
};

const updateStock = async (productId: string, adjustQuantity: number) => {
  let difference = 0;

  function updateDifference(substraction: number) {
    difference -= substraction;
  }

  function setDifferenceValue(value: number) {
    difference = value;
  }
  async function start() {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stocks: true,
        category: true,
      },
    });
    const farthest2 = product?.stocks
      .filter((v) => v.quantity !== 0)
      .reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
    if (difference > 0 && farthest2) {
      if (farthest2.quantity >= difference) {
        const updated = prisma.stock.update({
          where: { id: farthest2.id },
          data: { quantity: farthest2.quantity - difference },
        });
        await prisma
          .$transaction([updated])
          .then(() => updateLatestQuantity(product?.id as string));
        return;
      }

      updateDifference(farthest2.quantity);
      const updated = prisma.stock.update({
        where: { id: farthest2.id },
        data: { quantity: farthest2.quantity - farthest2.quantity },
      });
      await prisma.$transaction([updated]).then(() => {
        updateLatestQuantity(product?.id as string);
        start();
      });
    }
  }
  if (difference === 0) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        stocks: true,
        category: true,
      },
    });
    const farthest1 = product?.stocks
      .filter((v) => v.quantity !== 0)
      .reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
    if (farthest1) {
      if (farthest1.quantity >= adjustQuantity) {
        const updated = prisma.stock.update({
          where: { id: farthest1.id },
          data: { quantity: farthest1.quantity - adjustQuantity },
        });
        await prisma
          .$transaction([updated])
          .then(() => updateLatestQuantity(product?.id as string));
        return;
      }
      const updated = prisma.stock.update({
        where: { id: farthest1.id },
        data: { quantity: farthest1.quantity - farthest1.quantity },
      });
      setDifferenceValue(adjustQuantity - farthest1.quantity);
      await prisma.$transaction([updated]).then(() => {
        updateLatestQuantity(product?.id as string);
        start();
      });
    }
  }
};

router.use(auth).patch(async (req, res) => {
  const { id } = req.query;
  const { role } = req.user;

  try {
    if (role !== 'KSBU') {
      throw new Error('FORBIDDEN');
    }
    const notif = await prisma.notif.findUnique({
      where: { id: id as string },
      select: {
        id: true,
        adjustment: {
          select: {
            productId: true,
            adjustQuantity: true,
          },
        },
      },
    });

    await prisma.notif.update({
      where: {
        id: notif?.id,
      },
      data: {
        status: 'APPROVED',
      },
    });

    notif?.adjustment &&
      updateStock(
        notif.adjustment.productId as string,
        notif.adjustment.adjustQuantity,
      );
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
