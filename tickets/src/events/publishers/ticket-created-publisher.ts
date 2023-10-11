import { Publisher, TicketCreatedEvent, Subjects } from '@m-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
