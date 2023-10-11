import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@m-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);    

    if (!ticket) {
      throw new NotFoundError();
    }

    const { price, title } = data;
    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}
