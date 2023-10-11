import { OrderCreatedEvent, Publisher, Subjects } from '@m-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
