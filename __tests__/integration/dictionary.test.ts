import {
  describe, 
  expect, 
  test
} from '@jest/globals';
import request from 'supertest';


import app from './../../src/app';
import connectDatabase, { disconnectDatabase } from './../../src/config/databaseConfig';
import {
  DictionaryModel
} from './../../src/database';

describe('Dictionary integration tests', () => {
  const word = 'fire';

  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('Dictionary routes', () => {
    test('get list of words with pagination and search', async () => {
      const response = await request(app)
        .get('/entries/en')
        .query({
          search: word,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('totalDocs');
      expect(response.body).toHaveProperty('next');
      expect(response.body).toHaveProperty('previous');
      expect(response.body).toHaveProperty('hasNext');
      expect(response.body).toHaveProperty('hasPrev');
      expect(response.body.results.length).toBeGreaterThan(0);
    });
  });
});