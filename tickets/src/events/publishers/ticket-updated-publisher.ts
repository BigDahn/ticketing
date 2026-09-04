import { Publisher, Subjects, TicketUpdatedEvent } from '@bgticketz/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
