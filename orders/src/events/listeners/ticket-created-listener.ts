import { Listener, Subjects, TicketCreatedEvent } from '@m-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(
    data: TicketCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, price, title } = data;

    const ticket = Ticket.build({
      id,
      price,
      title,
    });

    await ticket.save();

    msg.ack();
  }
}
