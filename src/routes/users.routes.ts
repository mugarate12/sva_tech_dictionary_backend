import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';

import{
  userController
} from './../controllers';
import { authJWT } from './../middlewares';

export default function routes(routes: Router) {
  routes.get('/me', authJWT, userController.perfil);
}