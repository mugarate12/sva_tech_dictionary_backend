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

async function signInUser() {
  const email = 'emailteste123131@mail.com';
  const password = 'teste123';

  const user = await request(app)
    .post('/auth/signin')
    .send({
      email,
      password
    });

  return user.body.token;
}

describe('Dictionary integration tests', () => {
  const word = 'fire';
  let userToken = '';

  beforeAll(async () => {
    await connectDatabase();
    userToken = await signInUser();
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
        })
        .set('Authorization', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('totalDocs');
      expect(response.body).toHaveProperty('next');
      expect(response.body).toHaveProperty('previous');
      expect(response.body).toHaveProperty('hasNext');
      expect(response.body).toHaveProperty('hasPrev');
      expect(response.body.results.length).toBeGreaterThan(0);
    });

    test('get one word information', async () => {
      const response = await request(app)
        .get(`/entries/en/${word}`)
        .set('Authorization', userToken);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
      expect(response.body[0]).toHaveProperty('word');
      expect(response.body[0]).toHaveProperty('phonetic');
      expect(response.body[0]).toHaveProperty('phonetics');
      expect(response.body[0]).toHaveProperty('meanings');
      expect(response.body[0]).toHaveProperty('license');
      expect(response.body[0]).toHaveProperty('sourceUrls');
    });
  });
});