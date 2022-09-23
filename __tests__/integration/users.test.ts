import {
  describe, 
  expect, 
  test
} from '@jest/globals';
import request from 'supertest';

import app from './../../src/app';
import connectDatabase, { disconnectDatabase } from './../../src/config/databaseConfig';
import {
  UserModel
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

describe('Users integration tests', () => {
  const name = 'Mateus C';
  const email = 'mateusCardosoMail@mail.com';
  const password = '123456';

  let userToken = '';

  beforeAll(async () => {
    await connectDatabase();
    userToken = await signInUser();
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email });
    await disconnectDatabase();
  });

  describe('Authorization routes', () => {
    test('signup user', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          name,
          email,
          password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('token');
      expect(response.body.name).toBe(name);
      expect(response.body.token).toContain('Bearer');
    });

    test('signin user', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email,
          password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('token');
      expect(response.body.name).toBe(name);
      expect(response.body.token).toContain('Bearer');
    });
  });

  describe('Perfil routes', () => {
    test('get perfil informations', async () => {
      const userRequest = await request(app)
        .get('/user/me')
        .set('Authorization', userToken);

      expect(userRequest.status).toBe(200);
      expect(userRequest.body).toHaveProperty('id');
      expect(userRequest.body).toHaveProperty('name');
      expect(userRequest.body).toHaveProperty('email');
    });

    test('get history of words searched', async () => {
      const userHistoryRequest = await request(app)
        .get('/user/me/history')
        .set('Authorization', userToken);

      expect(userHistoryRequest.status).toBe(200);
      expect(userHistoryRequest.body).toHaveProperty('results');
      expect(userHistoryRequest.body).toHaveProperty('totalDocs');
      expect(userHistoryRequest.body).toHaveProperty('next');
      expect(userHistoryRequest.body).toHaveProperty('previous');
      expect(userHistoryRequest.body).toHaveProperty('hasNext');
      expect(userHistoryRequest.body).toHaveProperty('hasPrev');
      expect(userHistoryRequest.body.results.length).toBeGreaterThanOrEqual(0);
    });
  });
});