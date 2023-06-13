import auth from '@/lib/middlewares/auth';
import validate from '@/lib/middlewares/validate';
import { productSchema } from '@/lib/validation_schema';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router
  .get(async (_, res) => {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          latestQuantity: true,
          description: true,
          category: {
            select: {
              title: true,
            },
          },
          stocks: {
            select: {
              createdAt: true,
              price: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      const customProduct = products.map((product) => {
        const latestProduct =
          product.stocks.length === 0
            ? null
            : product.stocks.reduce((a, b) =>
                a.createdAt > b.createdAt ? a : b,
              );
        return {
          id: product.id,
          name: product.name,
          code: product.code,
          category: product.category.title,
          productDesc: product.description,
          stockDesc: latestProduct
            ? latestProduct.description
            : product.description || '',
          latestQuantity: product.latestQuantity,
          price: latestProduct ? latestProduct.price : 0,
        };
      });
      return res.json(customProduct);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })

  .use(auth)
  .use(validate(productSchema))
  .post(async (req, res) => {
    const {
      categoryId,
      code,
      description,
      name,
    }: {
      categoryId: string;
      code: string;
      description?: string;
      name: string;
    } = req.body;
    try {
      const product = await prisma.product.findUnique({
        where: {
          code,
        },
      });
      if (!product) {
        const createdProduct = await prisma.product.create({
          data: {
            categoryId,
            code,
            description,
            name,
          },
        });
        return res.json(createdProduct);
      }
      return res.status(400).json({ message: 'Produk sudah ada' });
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
