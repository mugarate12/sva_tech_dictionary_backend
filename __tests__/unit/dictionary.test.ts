import {
  describe, 
  expect, 
  test,
  beforeAll,
  afterAll
} from '@jest/globals';

import connectDatabase, { disconnectDatabase } from './../../src/config/databaseConfig';
import {
  DictionaryModel
} from './../../src/database';
import {
  dictionaryServices
} from './../../src/services';
import {
  getAllWordsInApiAndSaveInDatabase
} from './../../src/routines/dictionary.routine';

describe('Dictionary unit tests', () => {
  const word = 'fire';

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await DictionaryModel.deleteOne({ word });
    await disconnectDatabase();
  });

  describe('Dictionary services tests', () => {
    test('get all words of dictionary in FreeDictionaryAPI', async () => {
      const words = await dictionaryServices.getAllWords();

      expect(words).not.toBeNull();
      expect(words).not.toBeUndefined();
      expect(words.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Dictionary model tests', () => {
    test('create word', async () => {
      const newWord = new DictionaryModel({
        word
      });

      const savedWord = await newWord.save();

      expect(savedWord).not.toBeNull();
      expect(savedWord).not.toBeUndefined();
      expect(savedWord.word).toBe(word);
    });

    test('find word', async () => {
      const wordFound = await DictionaryModel.findOne({ word });

      expect(wordFound).not.toBeNull();
      expect(wordFound).not.toBeUndefined();
      if (!wordFound) return;
      expect(wordFound.word).toBe(word);
    });

    test('get all words', async () => {
      const words = await DictionaryModel.find();

      expect(words).not.toBeNull();
      expect(words).not.toBeUndefined();
      expect(words.length).toBeGreaterThan(0);
    }, 100000);

    test('delete word', async () => {
      const wordDeleted = await DictionaryModel.deleteOne({ word });

      expect(wordDeleted).not.toBeNull();
      expect(wordDeleted).not.toBeUndefined();
      expect(wordDeleted.deletedCount).toBe(1);
    });
  });

  describe('Dictionary routine tests', () => {
    test('save all words in database', async () => {
      await getAllWordsInApiAndSaveInDatabase(20);
      const wordsInDatabase = await DictionaryModel.find();
      const wordsInAPI = await dictionaryServices.getAllWords();

      expect(wordsInDatabase).not.toBeNull();
      expect(wordsInDatabase).not.toBeUndefined();
      expect(wordsInDatabase.length).toBeGreaterThan(0);
      expect(wordsInAPI.length).toBeGreaterThanOrEqual(wordsInDatabase.length);
    }, 100000);
  });
});