import { Request, Response } from 'express';

import {
  usersService
} from  './../services';

export default class AuthorizationController {
  public async signup(req: Request, res: Response) {
    const { name, email, password } = req.body;

    
  }
}
