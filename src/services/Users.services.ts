import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

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
    return jwt.sign({
      id: userID
    }, JWT_SECRET, {})
  }
}