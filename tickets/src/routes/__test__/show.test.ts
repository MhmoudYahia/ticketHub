import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 is the ticket if not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).expect(404);
});

it('returns 200 if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 50 });

  const ticketRes = await request(app).get(
    `/api/tickets/${response.body.ticket.id}`
  );
  expect(ticketRes.statusCode).toEqual(200);
  expect(ticketRes.body.ticket.title).toEqual('title');
  expect(ticketRes.body.ticket.price).toEqual(50);
});
