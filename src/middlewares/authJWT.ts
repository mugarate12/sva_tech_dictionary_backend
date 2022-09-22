import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { handleError } from './../utils';
import { constants } from './../config';

interface jwtPayload {
  id: string;
}

async function jwtVerifyPromissed(token: string, secret: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(undefined);
      } else {
        if (decoded && typeof decoded === 'object') {
          resolve(decoded.id);
        }
      }
    });
  });
}

export default async function authJWTPromissed(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: 'Token inválido, por favor, verifique o token e credenciais informadas' })
  }

  const [schema, token] = authHeader.split(' ');

  return await jwtVerifyPromissed(token, constants.JWT_SECRET)
    .then(decodedID => {
      res.setHeader(constants.headerUserID, String(decodedID));
      return next();
    })
    .catch(() => {
      return res.status(400).json({ message: 'Token inválido, por favor, verifique o token e credenciais informadas' })
    });
}
