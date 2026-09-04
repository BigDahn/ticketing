import { Publisher, Subjects, TicketCreatedEvent } from '@bgticketz/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
