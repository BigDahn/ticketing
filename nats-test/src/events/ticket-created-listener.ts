import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; // readonly is a TypeScript feature that makes the subject property immutable, meaning it cannot be changed after it is set. This is important because the subject of an event should not change once it is defined, as it represents the type of event being listened to. By making it readonly, we ensure that the subject remains consistent and cannot be accidentally modified, which could lead to unexpected behavior in the event handling process.
  queueGroupName = 'payment-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
