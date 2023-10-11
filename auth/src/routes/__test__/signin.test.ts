import request from 'supertest';
import { app } from '../../app';

it('fails when email does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when password is wrong', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@example.com',
      password: 'passwkkkkord',
    })
    .expect(400);
});

it('sets a cookie on a successfull signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
