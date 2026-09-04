import { Subjects, Publisher, PaymentCreatedEvent } from '@bgticketz/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
