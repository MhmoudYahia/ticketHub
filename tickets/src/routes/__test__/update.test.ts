import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('return 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 })
    .expect(404);
});

it('return 401 if the user is not signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'title', price: 10 })
    .expect(401);
});

it('return 401 if the user does not own the ticket', async () => {
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${res.body.ticket.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 })
    .expect(401);
});

it('return 400 if the title or the price is not valid', async () => {
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${res.body.ticket.id}`)
    .set('Cookie', global.signin())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.ticket.id}`)
    .set('Cookie', global.signin())
    .send({ title: 'title', price: -10 })
    .expect(400);
});

it('return 200 if the ticket updated successfully', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${res.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(200);

  const ticketRes = await request(app).get(
    `/api/tickets/${res.body.ticket.id}`
  );

  expect(ticketRes.body.ticket.price).toEqual(100);
  expect(ticketRes.body.ticket.title).toEqual('new title');
});

it('publish an event', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  await request(app)
    .put(`/api/tickets/${res.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('return error if the ticket is reserved', async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({ title: 'title', price: 10 });

  const ticket = await Ticket.findById(res.body.ticket.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.ticket.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(400);
});
