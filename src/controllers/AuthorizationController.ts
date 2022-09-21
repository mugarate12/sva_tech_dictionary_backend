import { Request, Response } from 'express';

import {
  usersService
} from  './../services';
import {
  UserModel
} from './../database';
import {
  handleError
} from './../utils';

export default class AuthorizationController {
  public async signup(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const id = usersService.generateUUID();
    const encryptedPassword = await usersService.encryptPassword(password);
    const user = new UserModel({
      id,
      name,
      email,
      password: encryptedPassword
    });

    return await user.save()
      .then(() => {
        const token = usersService.createUserToken(id);

        return res.status(201).json({
          id,
          name,
          token: `Bearer ${token}`
        });
      })
      .catch((err) => {
        console.log('create user error: ', err);
        return handleError.errorHandler(
          new handleError.AppError('User Error', 403, 'User not created, try again later', false),
          res
        );
      });
  }

  public async signin(req: Request, res: Response) {
    const { email, password } = req.body;

    const userFounded = await UserModel.findOne({ email });

    if (!userFounded) {
      return handleError.errorHandler(
        new handleError.AppError('User Error', 404, 'User not found', false),
        res
      );
    }

    const comparePassword = await usersService.comparePassword(password, userFounded.password);
    if (!comparePassword) {
      return handleError.errorHandler(
        new handleError.AppError('User Error', 404, 'User not found', false),
        res
      );
    }

    const token = usersService.createUserToken(userFounded.id);
    return res.status(200).json({
      id: userFounded.id,
      name: userFounded.name,
      token: `Bearer ${token}`
    });
  }
}
