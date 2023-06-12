import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router.use(auth).patch(async (req, res) => {
  const { proposalId, note } = req.body;
  const { role } = req.user;
  try {
    if (role !== 'KSBU') {
      throw new Error('FORBIDDEN');
    }
    await prisma.notif.update({
      where: {
        proposalId,
      },
      data: {
        status: 'INSTRUCTION',
        note: note || null,
      },
    });
    return res.json({ message: 'Proposal updated' });
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
