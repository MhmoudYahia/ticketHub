import { app } from '../../app';
import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('check that the server has /api/tickets post', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.statusCode).not.toEqual(404);
});

it('check that the /api/tickets post can be accessed only if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status code other than 401 if the user is signed in', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({});

  expect(response.statusCode).not.toEqual(401);
});

it('returns error if the title is invalid', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 50,
    })
    .expect(400);
});
it('returns error if the price is invalid', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '55emmd', price: -50 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '55emmd' })
    .expect(400);
});

it('ticket is created with a valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 50 });

  expect(response.statusCode).toEqual(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it('ticket is published after creation', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'title', price: 50 })
    .expect(201);
    

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
