import { Publisher, TicketUpdatedEvent, Subjects } from '@m-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
