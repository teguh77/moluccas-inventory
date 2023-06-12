import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (_, res) => {
  try {
    const deliveryNotes = await prisma.deliveryNote.findMany();
    res.json(deliveryNotes);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
