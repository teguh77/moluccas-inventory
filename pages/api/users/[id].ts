import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).delete(async (req, res): Promise<void> => {
  const { id } = req.query;
  const { role } = req.user;
  try {
    if (role !== 'KSBU') {
      throw new Error('FORBIDDEN!');
    }
    const deleteRule = prisma.rule.deleteMany({
      where: {
        userId: id as string,
      },
    });
    const deleteUser = prisma.user.delete({
      where: {
        id: id as string,
      },
    });
    await prisma.$transaction([deleteUser, deleteRule]);
    return res.json({ message: 'User deleted' });
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
