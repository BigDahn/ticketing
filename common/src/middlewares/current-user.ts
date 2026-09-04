// @ts-ignore

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// to add types to the payload of the JWT, we need to create an interface that describes the properties of the payload
interface UserPayload {
  id: string;
  email: string;
}

// to add a new property to the Request object, we need to declare a global namespace
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      session?: {
        jwt?: string;
      } | null;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!,
    ) as UserPayload;
    req.currentUser = payload;
    return next();
  } catch (err) {
    return next();
  }
};
