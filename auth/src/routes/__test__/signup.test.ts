import request from 'supertest';

import { app } from '../../app';

it('returns 201 on a successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(201);
});

it('returns 400 on an invalid password (signup)', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'pass',
      passwordConfirm: 'pass',
      name: 'user',
    })
    .expect(400);
});

it('returns 400 on an invalid email (signup)', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(400);
});

it('returns 400 on not identical passwords', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
      passwordConfirm: 'pssword',
      name: 'user',
    })
    .expect(400);
});

it('returns 400 on a missing password or email (signup)', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'userexample.com',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);
  return request(app).post('/api/users/signup').send({}).expect(400);
});

it('dissallowing multiple emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(400);
});

it('sets a cookie after successfull signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
