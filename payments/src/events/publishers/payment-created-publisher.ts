import { PaymentCreatedEvent, Publisher, Subjects } from '@m-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
