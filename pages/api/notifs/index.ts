import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

export const getApiNotifs = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
) => {
  const { role, userId } = req.user;
  let notif = [];

  try {
    if (role === 'KSBU') {
      const firstNotif = await prisma.notif.findMany({
        where: {
          OR: [{ status: 'NOTHING' }, { status: 'PURE' }],
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      const secondNotif = await prisma.notif.findMany({
        where: {
          NOT: [
            {
              status: 'NOTHING',
            },
            {
              status: 'APPROVED',
            },
          ],
          type: 'STOCKOUT',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      const KSBUNotif = firstNotif.concat(secondNotif);
      return res.json(KSBUNotif);
    } else if (role === 'RT') {
      const firstNotif = await prisma.notif.findMany({
        where: {
          NOT: [
            {
              status: 'NOTHING',
            },
            {
              status: 'PURE',
            },
            {
              status: 'READY',
            },
            {
              status: 'REJECTED',
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      const secondNotif = await prisma.notif.findMany({
        where: {
          NOT: [
            {
              status: 'NOTHING',
            },
            {
              status: 'APPROVED',
            },
          ],
          type: 'STOCKOUT',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      const RTNotif = firstNotif.concat(secondNotif);
      return res.json(RTNotif);
    } else {
      const anyNotif = await prisma.notif.findMany({
        where: {
          OR: [{ status: 'READY' }, { status: 'REJECTED' }],
          type: 'STOCKOUT',
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      });
      return res.json(anyNotif);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

router.use(auth).get((req, res) => getApiNotifs(req, res));

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
