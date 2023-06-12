import { format, getMonth } from 'date-fns';
import auth from '@/lib/middlewares/auth';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

const monthName = [
  'jan',
  'feb',
  'mar',
  'apr',
  'mei',
  'jun',
  'jul',
  'agu',
  'sep',
  'okt',
  'nov',
  'des',
];

interface IOrder {
  products: [{ productId: string | null; incart: number | null }];
}

type Num = {
  max: number;
};

const today = format(new Date(), 'yyyyMMdd');

async function createReferenceNumber() {
  try {
    const nums = await prisma.$queryRaw<
      Num[]
    >`SELECT max(right(reference_number, 6)) FROM delivery_notes`;
    let n;
    nums.forEach((num) => {
      if (num.max !== null) {
        const zeroPad = (number: number, places: number) =>
          String(number).padStart(places, '0');
        const finalNum = Number(num.max) + 1;
        n = zeroPad(finalNum, 6);
      } else {
        n = null;
      }
    });
    if (n != null) return `DN${today}${n}`;
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
}

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

router
  .use(auth)
  .post(async (req, res) => {
    const { products }: IOrder = req.body;
    const { userId } = req.user;
    let difference = 0;

    function updateDifference(substraction: number) {
      difference -= substraction;
    }

    function setDifferenceValue(value: number) {
      difference = value;
    }

    try {
      const order = await prisma.order.create({
        data: {
          userId: userId as string,
        },
      });
      products.forEach(async (p) => {
        const product = await prisma.product.findUnique({
          where: { id: p.productId as string },
          include: {
            stocks: true,
            category: true,
          },
        });

        async function updateStock() {
          async function start() {
            const myproduct = await prisma.product.findUnique({
              where: { id: p.productId as string },
              include: {
                stocks: true,
                category: true,
              },
            });
            const farthest2 = myproduct?.stocks
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
                  .then(() => updateLatestQuantity(myproduct?.id as string));
                return;
              }

              updateDifference(farthest2.quantity);
              const updated = prisma.stock.update({
                where: { id: farthest2.id },
                data: { quantity: farthest2.quantity - farthest2.quantity },
              });
              await prisma.$transaction([updated]).then(() => {
                updateLatestQuantity(myproduct?.id as string);
                start();
              });
            }
          }
          if (difference === 0) {
            const myproduct = await prisma.product.findUnique({
              where: { id: p.productId as string },
              include: {
                stocks: true,
                category: true,
              },
            });
            const farthest1 = myproduct?.stocks
              .filter((v) => v.quantity !== 0)
              .reduce((a, b) => (a.createdAt < b.createdAt ? a : b));
            if (farthest1 && p?.incart) {
              if (farthest1.quantity >= p?.incart) {
                const updated = prisma.stock.update({
                  where: { id: farthest1.id },
                  data: { quantity: farthest1.quantity - p.incart },
                });
                await prisma
                  .$transaction([updated])
                  .then(() => updateLatestQuantity(myproduct?.id as string));
                return;
              }
              const updated = prisma.stock.update({
                where: { id: farthest1.id },
                data: { quantity: farthest1.quantity - farthest1.quantity },
              });
              p?.incart && setDifferenceValue(p.incart - farthest1.quantity);
              await prisma.$transaction([updated]).then(() => {
                updateLatestQuantity(myproduct?.id as string);
                start();
              });
            }
          }
        }
        updateStock();
        const latestProduct = product?.stocks.reduce((a, b) =>
          a.createdAt > b.createdAt ? a : b,
        );
        await prisma.stockOut.create({
          data: {
            productId: product?.id,
            price: latestProduct?.price as number,
            quantity: p.incart as number,
            userId,
            category: product?.category.title,
            createdMonth: monthName[getMonth(new Date())],
          },
        });

        await prisma.cart.create({
          data: {
            productName: product?.name as string,
            productCode: product?.code as string,
            productCategory: product?.category.title as string,
            productQuantity: p.incart as number,
            orderId: (await order).id,
          },
        });
      });
      await prisma.deliveryNote.create({
        data: {
          referenceNumber:
            (await createReferenceNumber()) != null
              ? ((await createReferenceNumber()) as string)
              : `DN${today}000001`,
          orderId: (await order).id,
        },
      });
      return res.json({ message: 'Order created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (_, res) => {
    try {
      const cart = await prisma.order.findMany({
        include: {
          carts: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.json(cart);
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
