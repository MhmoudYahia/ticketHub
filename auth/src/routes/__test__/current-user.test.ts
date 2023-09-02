import { app } from '../../app';
import request from 'supertest';

it('responds with current user details if authenticated', async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);

  expect(res.body.currentUser.email).toEqual('user@example.com');
});

it('responds with null if no user authenticated', async () => {
  const res = await request(app).get('/api/users/currentuser').expect(200);

  expect(res.body.currentUser).toEqual(null);
});
