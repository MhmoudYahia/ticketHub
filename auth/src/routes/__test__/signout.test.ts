import { app } from '../../app';
import request from 'supertest';

it('no cookie after successfull signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'user@example.com',
      password: 'password',
      passwordConfirm: 'password',
      name: 'user',
    })
    .expect(201);

  const res = await request(app).post('/api/users/signout').expect(200);

  expect(res.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
