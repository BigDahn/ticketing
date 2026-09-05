import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@bgticketz/common';
import { Ticket } from '../../models/ticket.js';
import { queueGroupName } from './queue-group-name.js';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
}
