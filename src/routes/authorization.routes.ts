import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';

import { authorizationController } from '../controllers';

export default function routes(routes: Router) {
  routes.post('/auth/signup', celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }), authorizationController.signup);

  routes.post('/auth/signin', celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  }), authorizationController.signin);
}