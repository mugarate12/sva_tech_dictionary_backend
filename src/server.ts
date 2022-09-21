import dotenv from 'dotenv';

import server from './app';
import routines from './routines';

import connectDatabase from './config/databaseConfig';

dotenv.config();

const PORT = !process.env.PORT ? 8000 :  process.env.PORT;

connectDatabase()
  .then(() => {
    routines();

    server.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch(() => {
    server.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  });
