import { Router } from 'express';
import { Joi, Segments, celebrate } from 'celebrate';

import { 
  dictionaryController
} from '../controllers';
import { authJWT } from './../middlewares';

export default function routes(routes: Router) {
  routes.get('/entries/en', celebrate({
    [Segments.QUERY]: Joi.object().keys({
      search: Joi.string().optional(),
      cursor: Joi.string().optional(),
      limit: Joi.number().optional()
    })
  }), authJWT, dictionaryController.index);
}