import { Router } from 'express';

import authorizationRoutes from './authorization.routes';
import dictionaryRoutes from './dictionary.routes';
import userRoutes from './users.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Fullstack Challenge 🏅 - Dictionary" });
});

authorizationRoutes(routes);
dictionaryRoutes(routes);
userRoutes(routes);

export default routes;