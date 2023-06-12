import { hash } from 'bcrypt';
import auth from '@/lib/middlewares/auth';
import validate from '@/lib/middlewares/validate';
import { registerSchema } from '@/lib/validation_schema';
import prisma from '@/lib/prisma';
import { Prisma } from '.prisma/client';

import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextApiRequestExtended } from '@/lib/types';

const router = createRouter<NextApiRequestExtended, NextApiResponse>();

router
  .use(auth)
  .use(validate(registerSchema))
  .post(async (req, res) => {
    const { username, password, fullname, role }: Prisma.UserCreateInput =
      req.body;
    const { role: userRole } = req.user;
    try {
      if (userRole !== 'KSBU') {
        throw new Error('FORBIDDEN');
      }
      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (!user) {
        const hashed = await hash(password, 10);
        const userCreated = await prisma.user.create({
          data: {
            username,
            password: hashed,
            fullname,
            role,
          },
        });
        if (userCreated) {
          await prisma.rule.create({
            data: {
              userId: userCreated.id,
            },
          });
          return res.json({ message: 'User telah dibuat' });
        }
      }
      return res.status(400).json({ message: 'User sudah ada' });
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
