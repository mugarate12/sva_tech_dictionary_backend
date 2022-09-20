import server from './app';
import dotenv from 'dotenv';

import connectDatabase from './config/databaseConfig';

dotenv.config();

const PORT = !process.env.PORT ? 8000 :  process.env.PORT;

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch(() => {
    server.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  });
