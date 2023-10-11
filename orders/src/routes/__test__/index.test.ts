import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import mongoose from 'mongoose';

it('return all orders of a user', async () => {
  // build 3 tickets to test on them
  const ticket1 = Ticket.build({
    title: 'Customer',
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket1.save();

  const ticket2 = Ticket.build({
    title: 'Customer',
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket2.save();

  const ticket3 = Ticket.build({
    title: 'Customer',
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket3.save();

  // two  users
  const user1 = global.signin();
  const user2 = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order1Body } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order2Body } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const { body: ordersBody } = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  expect(ordersBody.orders.length).toEqual(2);
  expect(ordersBody.orders[0].id).toEqual(order1Body.order.id);
  expect(ordersBody.orders[1].id).toEqual(order2Body.order.id);

  expect(ordersBody.orders[0].ticket.id).toEqual(ticket2.id);
  expect(ordersBody.orders[1].ticket.id).toEqual(ticket3.id);
});
