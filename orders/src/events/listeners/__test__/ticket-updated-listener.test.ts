import { TicketUpdatedEvent } from '@m-ticketing/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create an instance of a  listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // make the ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Ticket Created',
    price: 50,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Ticket',
    price: 100,
    userId: 'ouegc9eg',
    version: ticket.version + 1,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('find, update and save  a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage function with the data object and the message
  await listener.onMessage(data, msg);

  // check
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object and the message
  await listener.onMessage(data, msg);

  //check
  expect(msg.ack).toHaveBeenCalled();
});

it('do not call ack if the version is wrong', async () => {
  const { listener, data, msg } = await setup();

  data.version = 30;

  //call the onMessage function with the data object and the message
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  //check
  expect(msg.ack).not.toHaveBeenCalled();
});
