import { TicketUpdatedPublisher } from './../publishers/ticket-updated-publisher.js';
import { Listener, OrderCancelledEvent, Subjects } from '@bgticketz/common';
import { queueGroupName } from './queueGroupName.js';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket.js';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
    });

    msg.ack();
  }
}
