import CronJob from 'cron';

import { DictionaryModel } from './../database';
import { dictionaryServices } from './../services';

const everyDay = '0 0 * * *';

export async function getAllWordsInApiAndSaveInDatabase(maxWordsToSave?: number) {
  const wordsInDatabase = await DictionaryModel.find().transform((words) => {
    return words.map((word) => word.word);
  });
  const wordsInAPI = await dictionaryServices.getAllWords();

  const wordsToSave = wordsInAPI.filter((word) => !wordsInDatabase.includes(word));

  // process one request per word
  for (let index = 0; index < wordsToSave.length; index++) {
    if (maxWordsToSave && index + 1 > maxWordsToSave) break;
    
    const word = wordsToSave[index];
    
    const newWord = new DictionaryModel({
      word
    });

    await newWord.save();
  }

  return maxWordsToSave ? maxWordsToSave : wordsToSave.length;
}

export const getAndSaveAllWordsRoutine = new CronJob.CronJob(everyDay, getAllWordsInApiAndSaveInDatabase);
