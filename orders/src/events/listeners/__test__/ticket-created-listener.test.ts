import { TicketCreatedEvent } from '@m-ticketing/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of a  listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Ticket',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create and save the ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object and the message
  await listener.onMessage(data, msg);

  // check
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object and the message
  await listener.onMessage(data, msg);

  //check
  expect(msg.ack).toHaveBeenCalled();
});
