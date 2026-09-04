import { Publisher, OrderCreatedEvent, Subjects } from '@bgticketz/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
