import auth from '@/lib/middlewares/auth';
import validate from '@/lib/middlewares/validate';
import { Rule, ruleSchema } from '@/lib/validation_schema';
import prisma from '@/lib/prisma';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

export const getApiRule = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
) => {
  const { userId } = req.user;
  try {
    const rule = await prisma.rule.findFirst({
      where: {
        userId,
      },
    });

    return res.json({
      activeStep: rule?.activeStep,
      allowAddToCart: rule?.allowAddToCart,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

router
  .use(auth)
  .use(validate(ruleSchema))
  .patch(async (req, res) => {
    const {
      activeStep,
      allowAddToCart,
      userId: userIdByAdmin,
    }: Rule = req.body;
    const { userId, role } = req.user;
    try {
      if (role !== 'USER') {
        const rule = await prisma.rule.findFirst({
          where: {
            userId: userIdByAdmin || userId,
          },
        });
        const updatedRule = await prisma.rule.update({
          where: {
            id: rule?.id,
          },
          data: {
            activeStep,
            allowAddToCart,
          },
        });
        return res.json({
          activeStep: updatedRule.activeStep,
          allowAddToCart: updatedRule.allowAddToCart,
        });
      }
      const rule = await prisma.rule.findFirst({
        where: {
          userId,
        },
      });
      const updatedRule = await prisma.rule.update({
        where: {
          id: rule?.id,
        },
        data: {
          activeStep,
          allowAddToCart,
        },
      });
      return res.json({
        activeStep: updatedRule.activeStep,
        allowAddToCart: updatedRule.allowAddToCart,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .get((req, res) => getApiRule(req, res));

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
