import { Router } from 'express';

import authorizationRoutes from './authorization.routes';

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Fullstack Challenge 🏅 - Dictionary" });
});

authorizationRoutes(routes);

export default routes;