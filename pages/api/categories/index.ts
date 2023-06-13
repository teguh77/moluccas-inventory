import auth from '@/lib/middlewares/auth';
import validate from '@/lib/middlewares/validate';
import { categorySchema } from '@/lib/validation_schema';
import prisma from '@/lib/prisma';
import { Prisma } from '.prisma/client';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

export const getCat = async (_: any, res: NextApiResponse) => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(categories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

router
  .get((req, res) => getCat(req, res))
  .use(auth)
  .use(validate(categorySchema))
  .post(async (req, res) => {
    const { title }: Prisma.CategoryCreateInput = req.body;
    try {
      const category = await prisma.category.findFirst({
        where: {
          title: {
            equals: title,
            mode: 'insensitive',
          },
        },
      });
      if (!category) {
        const createdCategory = await prisma.category.create({
          data: {
            title: title.toLowerCase(),
          },
        });
        return res.json(createdCategory);
      }
      return res.status(400).json({ message: 'Kategori sudah ada' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
