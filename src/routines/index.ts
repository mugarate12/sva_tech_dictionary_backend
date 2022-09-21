import {
  getAllWordsInApiAndSaveInDatabase,
  getAndSaveAllWordsRoutine
} from './dictionary.routine';

export default async () => {
  // initial routine in start of service
  await getAllWordsInApiAndSaveInDatabase();

  // cron jobs start
  getAndSaveAllWordsRoutine.start();
}
