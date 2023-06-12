import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).patch(async (req, res) => {
  const { id } = req.query;
  const { role } = req.user;
  const { status, description } = req.body;
  try {
    if (role === 'USER') {
      throw new Error('FORBIDDEN');
    }
    await prisma.notif.update({
      where: {
        id: id as string,
      },
      data: {
        status,
        description,
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
