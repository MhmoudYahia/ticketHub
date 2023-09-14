import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Test', price: 10 });
};
it('check on get all tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets');

  expect(res.body.tickets.length).toEqual(4);
  expect(res.body.tickets[0].price).toEqual(10);
  expect(res.body.tickets[0].title).toEqual('Test');
});
