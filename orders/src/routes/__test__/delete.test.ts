import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@m-ticketing/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('delete order', async () => {
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
    .delete(`/api/orders/${orderBody.order.id}`)
    .set('Cookie', user)
    .expect(204);

  const { body: cancelledBody } = await request(app)
    .get(`/api/orders/${orderBody.order.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(cancelledBody.order.status).toEqual(OrderStatus.Cancelled);
});

it('returns error if another one that not owns the order tried to cancell', async () => {
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
    .delete(`/api/orders/${orderBody.order.id}`)
    .set('Cookie', global.signin())
    .expect(401);
});

it('emits an event when the order is canceled', async () => {
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
    .delete(`/api/orders/${orderBody.order.id}`)
    .set('Cookie', user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
