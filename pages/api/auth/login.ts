import { compare } from 'bcrypt';
import cookie from 'cookie';
import { sign } from 'jsonwebtoken';
import validate from '@/lib/middlewares/validate';
import { Login, loginSchema } from '@/lib/validation_schema';
import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { getJwtSecret } from '@/lib/auth';

const router = createRouter<NextApiRequest, NextApiResponse>();
/*
@LOGIN

*/
router.use(validate(loginSchema)).post(async (req, res): Promise<void> => {
  const { username, password }: Login = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(401).json({ message: 'Invalid Credentials' });
    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const payload = { userId: user.id, username };
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime('10h')
      .sign(new TextEncoder().encode(getJwtSecret()));

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('authorization', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 86400,
        path: '/',
      }),
    );
    return res.json(user);
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
