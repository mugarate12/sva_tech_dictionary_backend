import { Router } from 'express';

import authorizationRoutes from './authorization.routes';
import dictionaryRoutes from './dictionary.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Fullstack Challenge 🏅 - Dictionary" });
});

authorizationRoutes(routes);
dictionaryRoutes(routes);

export default routes;