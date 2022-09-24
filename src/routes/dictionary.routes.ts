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

  routes.get('/entries/en/:word', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      word: Joi.string().required()
    })
  }), authJWT, dictionaryController.get);

  routes.post('/entries/en/:word/favorite', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      word: Joi.string().required()
    })
  }), authJWT, dictionaryController.favorite);

  routes.get('/proxy/:word', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      word: Joi.string().required()
    })
  }), dictionaryController.getWithProxy);

  routes.delete('/entries/en/:word/unfavorite', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      word: Joi.string().required()
    })
  }), authJWT, dictionaryController.unfavorite);
}