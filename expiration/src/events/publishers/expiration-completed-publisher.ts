import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from '@m-ticketing/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
