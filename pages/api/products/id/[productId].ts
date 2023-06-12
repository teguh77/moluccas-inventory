import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const { productId } = req.query;
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId as string,
      },
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
    });
    const latestProduct =
      product?.stocks.length === 0
        ? null
        : product?.stocks.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
    return res.json({
      id: product?.id,
      name: product?.name,
      code: product?.code,
      category: product?.category.title,
      productDesc: product?.description,
      stockDesc: latestProduct
        ? latestProduct?.description
        : product?.description || '',
      latestQuantity: product?.latestQuantity,
      price: latestProduct ? latestProduct.price : 0,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
