import { format } from 'date-fns';
import auth from '@/lib/middlewares/auth';
import validate from '@/lib/middlewares/validate';
import { incartSchema } from '@/lib/validation_schema';
import prisma from '@/lib/prisma';
import { IncartDetail } from '@prisma/client';
import { NextApiRequestExtended } from '@/lib/types';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

interface Incart {
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
    >`SELECT max(right(reference_number, 6)) FROM request_notes`;
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
    if (n != null) return `RN${today}${n}`;
    return null;
  } catch (error: any) {
    throw new Error(error);
  }
}

// create incart, notif dan reqNotes
router
  .use(auth)
  .use(validate(incartSchema))
  .post(async (req, res) => {
    const { products }: Incart = req.body;
    const { userId } = req.user;
    try {
      const incart = await prisma.incart.create({
        data: {
          userId: userId as string,
        },
      });
      const notif = await prisma.notif.create({
        data: {
          userId,
          type: 'STOCKOUT',
          description: 'Permohonan Permintaan Barang',
        },
      });
      products.forEach(async (p) => {
        const product = await prisma.product.findUnique({
          where: { id: p.productId as string },
          select: {
            id: true,
            name: true,
            code: true,
            latestQuantity: true,
            category: {
              select: {
                title: true,
              },
            },
          },
        });
        product &&
          (await prisma.incartDetail.create({
            data: {
              productId: product.id,
              productName: product.name,
              productCategory: product.category.title,
              productCode: product.code,
              productIncart: p.incart as number,
              productQuantity: product.latestQuantity,
              incartId: (await incart).id,
            },
          }));
        product &&
          (await prisma.notifCart.create({
            data: {
              productCode: product.code,
              productName: product.name,
              productCategory: product.category.title,
              productQuantity: p.incart as number,
              notifId: (await notif).id,
            },
          }));
      });
      await prisma.requestNote.create({
        data: {
          referenceNumber:
            (await createReferenceNumber()) != null
              ? ((await createReferenceNumber()) as string)
              : `RN${today}000001`,
          incartId: (await incart).id,
        },
      });
      return res.json({ message: 'Incart created' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .patch(async (req, res) => {
    const { incarts }: { incarts: IncartDetail[] } = req.body;
    try {
      incarts?.forEach(async (item) => {
        const updateIncarts = prisma.incartDetail.update({
          where: {
            id: item.id,
          },
          data: {
            productIncart: item.productIncart,
          },
        });
        await prisma.$transaction([updateIncarts]);
      });
      return res.json({ message: 'update incart success' });
    } catch (err) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get(async (req, res) => {
    const { userId } = req.user;
    try {
      const incart = await prisma.incart.findFirst({
        where: {
          userId: userId as string,
        },
        include: {
          products: true,
        },
      });

      const fix = incart?.products.map((i) => {
        return {
          productId: i.productId,
          incart: i.productIncart,
        };
      });

      return res.json(fix);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .delete(async (req, res) => {
    const { userId } = req.user;
    try {
      const incartDetail = prisma.incartDetail.deleteMany({
        where: {
          incart: {
            userId: userId as string,
          },
        },
      });
      const incart = prisma.incart.deleteMany({
        where: {
          userId: userId as string,
        },
      });
      await prisma.$transaction([incartDetail, incart]);
      return res.json({ message: 'Delete success' });
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
