import { Listener, OrderCreatedEvent, Subjects } from '@bgticketz/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is reserving

    const ticket = await Ticket.findById(data.ticket.id);

    // if no ticket throw error

    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    // Mark the ticket as being reserved bt setting it's orderId property

    ticket.set({ orderId: data.id });

    // save the ticket

    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack the message

    msg.ack();
  }
}
