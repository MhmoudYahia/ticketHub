import { OrderCancelledEvent, Publisher, Subjects } from '@m-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
