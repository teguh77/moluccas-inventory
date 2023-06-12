import { jwtVerify } from 'jose';
import { verify } from 'jsonwebtoken';

type TUser = {
  username: string;
  userId: string;
};

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error('The Environemt SECRET is not set.');
  }

  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecret()),
    );
    return verified.payload as TUser;
  } catch (err) {
    console.log(err);
  }
};
