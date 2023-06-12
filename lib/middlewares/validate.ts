import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export default function validate(schema: any) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler,
  ): Promise<void> => {
    if (['POST', 'PUT', 'PATCH'].includes(req?.method || '')) {
      try {
        req.body = await schema
          .camelCase()
          .validate(req.body, { abortEarly: false });
        return next();
      } catch (error) {
        return res.status(400).json(error);
      }
    }
    return next();
  };
}
