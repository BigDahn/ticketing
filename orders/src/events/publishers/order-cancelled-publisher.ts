import { Subjects, Publisher, OrderCancelledEvent } from '@bgticketz/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
