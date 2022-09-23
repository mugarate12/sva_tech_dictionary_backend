import CronJob from 'cron';

import { DictionaryModel } from './../database';
import { dictionaryServices } from './../services';

const everyDay = '0 0 * * *';

export async function getAllWordsInApiAndSaveInDatabase(maxWordsToSave?: number) {
  const wordsInDatabase = await DictionaryModel.find().transform((words) => {
    return words.map((word) => word.word);
  });
  const wordsInAPI = await dictionaryServices.getAllWords();

  // process one request per word
  let wordsSaved = 0;
  for (let index = 0; index < wordsInAPI.length; index++) {
    if (maxWordsToSave && wordsSaved >= maxWordsToSave) break;
    
    const word = wordsInAPI[index];
    if (wordsInDatabase.includes(word)) continue;
    
    const newWord = new DictionaryModel({
      word
    });

    await newWord.save();
    wordsSaved++;
  }

  return maxWordsToSave ? maxWordsToSave : wordsSaved;
}

export const getAndSaveAllWordsRoutine = new CronJob.CronJob(everyDay, getAllWordsInApiAndSaveInDatabase);
