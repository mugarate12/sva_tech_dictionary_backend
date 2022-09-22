import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

import { constants } from './../config';

export default class UsersServices {
  public generateUUID() {
    const uuid = uuidv4();
    return uuid;
  }

  public encryptPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
  }

  public comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  public createUserToken(userID: string) {
    const payload = { id: userID };
    return jwt.sign(payload, constants.JWT_SECRET, {})
  }

  public getUserID(res: Response) {
    const tokenDecodedID = res.getHeader(constants.headerUserID);

    if (!tokenDecodedID) {
      return undefined;
    } else {
      return String(tokenDecodedID);
    }
  }
}