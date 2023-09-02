import { MongoMemoryReplSet } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../app';
import mongoose from 'mongoose';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  // This will create an new instance of "MongoMemoryReplSet" and automatically start all Servers
  mongo = await MongoMemoryReplSet.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const authRes = await request(app)
    .post('/api/users/signup')
    .send({ email: 'user@example.com', password: 'password' })
    .expect(201);

  const cookie = authRes.get('Set-Cookie');

  return cookie;
};
