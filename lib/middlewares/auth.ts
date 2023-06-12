import { verify } from 'jsonwebtoken';
import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import prisma from '@/lib/prisma';
import { NextApiRequestExtended } from '../types';

export default async function auth(
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler,
): Promise<void> {
  try {
    const { authorization } = req.cookies;
    if (!authorization) throw new Error('Unauthencticated');
    const { userId }: any = verify(authorization, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Unauthenticated');

    req.user = {
      userId: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
    };

    return next();
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
}
