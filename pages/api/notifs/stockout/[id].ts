import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).delete(async (req, res) => {
  const { id } = req.query;
  try {
    const notif = await prisma.notif.findFirst({
      where: {
        id: id as string,
        status: 'READY',
        type: 'STOCKOUT',
      },
    });

    const deleteNotifcart = prisma.notifCart.deleteMany({
      where: {
        notifId: notif?.id,
      },
    });

    const deleteNotif = prisma.notif.deleteMany({
      where: {
        id: id as string,
      },
    });
    await prisma.$transaction([deleteNotifcart, deleteNotif]);

    return res.json({ message: 'Notif with status approved deleted' });
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
