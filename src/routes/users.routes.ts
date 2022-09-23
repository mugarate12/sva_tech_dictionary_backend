import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';

import{
  userController
} from './../controllers';
import { authJWT } from './../middlewares';

export default function routes(routes: Router) {
  routes.get('/user/me', authJWT, userController.perfil);
  routes.get('/user/me/history', authJWT, celebrate({
    [Segments.QUERY]: {
      search: Joi.string().optional(),
      cursor: Joi.string().optional(),
      limit: Joi.number().optional()
    }
  }), authJWT, userController.history);
}