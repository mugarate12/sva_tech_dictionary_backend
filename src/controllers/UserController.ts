import { Request, Response } from 'express';

import {
  UserModel
} from './../database';
import {
  usersService
} from './../services';

export default class UserController {
  public async perfil (req: Request, res: Response) {
    const userID = String(usersService.getUserID(res));

    const user = await UserModel
      .findOne({ id: userID })
      .select({ id: 1, name: 1, email: 1});
    if (!user) {
      return res.status(400).json({ message: 'Usuário nâo encontrado!' });
    } else {
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email
      });
    }    
  }
}