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

describe('Users integration tests', () => {
  const name = 'Mateus C';
  const email = 'mateusCardosoMail@mail.com';
  const password = '123456';

  beforeAll(async () => {
    await connectDatabase();
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
});