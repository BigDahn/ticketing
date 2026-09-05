import { OrderCreatedEvent, OrderStatus } from '@bgticketz/common';
import { Ticket } from '../../../models/ticket.js';
import { jest } from '@jest/globals';
import { natsWrapper } from '../../../nats-wrapper.js';
import { OrderCreatedListener } from '../order-created-listener.js';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { getPublishedEventData } from './helper.js';

const setup = async () => {
  // create an instance of the listener

  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: '812991',
  });

  await ticket.save();

  // Create the fake data object

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asasasw',
    expiresAt: 'sdsdsds',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // fake Msg Object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // @ts-ignore
  // console.log(natsWrapper.client.publish.mock.calls);

  // or

  const eventData = getPublishedEventData<TicketUpdatedEvent['data']>(
    natsWrapper.client.publish,
  );

  expect(data.id).toEqual(eventData.orderId);
});
