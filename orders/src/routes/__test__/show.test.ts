import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the order id', async () => {
  const ticket = Ticket.build({
    title: 'Customer',
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();

  const { body: orderBody } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body } = await request(app)
    .get(`/api/orders/${orderBody.order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(body.order.id).toEqual(orderBody.order.id);
});

it('returns error if the user tried to fetch another ticket', async () => {
  const ticket = Ticket.build({
    title: 'Customer',
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();

  const { body: orderBody } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${orderBody.order.id}`)
    .set('Cookie', global.signin())
    .expect(401);
});
