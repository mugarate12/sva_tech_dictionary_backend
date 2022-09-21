import {
  describe, 
  expect, 
  test,
  beforeAll,
  afterAll
} from '@jest/globals';

import connectDatabase, { disconnectDatabase } from './../../src/config/databaseConfig';
import {
  UserModel
} from './../../src/database';
import {
  usersService
} from './../../src/services';

describe('Users tests', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await disconnectDatabase();
  });

  describe('User Services tests', () => {
    test('encrypt user password successful', async () => {
      const password = '123456';

      const encryptedPassword = await usersService.encryptPassword(password);
      const comparePassword = await usersService.comparePassword(password, encryptedPassword);

      expect(encryptedPassword).not.toBe(password);
      expect(comparePassword).toBe(true);
    });

    test('create user token', async () => {
      const id = usersService.generateUUID();

      const token = usersService.createUserToken(id);

      expect(token).not.toBe(id);
    });
  });

  describe('User Model tests', () => {
    const id = usersService.generateUUID();
    const name = 'Mateus';
    const email = 'mail@mail.com';
    const password = '123456';

    test('create user', async () => {
      const user = new UserModel({
        id,
        name,
        email,
        password
      });

      const userCreated = await user.save()
      
      expect(userCreated.id).toBe(id);
      expect(userCreated.name).toBe(name);
      expect(userCreated.email).toBe(email);
      expect(userCreated.password).toBe(password);
    });

    test('find user by id', async () => {
      const userFinded = await UserModel.findOne({ id })
      
      expect(userFinded).not.toBeNull();
      if (!userFinded) return;
      expect(userFinded.id).toBe(id);
      expect(userFinded.name).toBe(name);
      expect(userFinded.email).toBe(email);
      expect(userFinded.password).toBe(password);
    });

    test('update user', async () => {
      const newName = 'Mateus Cardoso';
      const newEmail = 'mateusMail@mail.com';
      const filter = { id };
      const payload = { name: newName, email: newEmail };

      const updateUserRequest = await UserModel.updateOne(filter, payload);

      expect(updateUserRequest.acknowledged).toBe(true);
      expect(updateUserRequest.modifiedCount).toBe(1);
    });

    test('delete user', async () => {
      const filter = { id };

      const userDeleted = await UserModel.deleteOne(filter);

      expect(userDeleted.acknowledged).toBe(true);
      expect(userDeleted.deletedCount).toBe(1);
    });
  });
});
