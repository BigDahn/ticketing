import mongoose from 'mongoose';
import { Order } from '../../../models/order.js';
import { jest } from '@jest/globals';
import { Ticket } from '../../../models/ticket.js';
import { natsWrapper } from '../../../nats-wrapper.js';
import {
  ExpirationCompleteEvent,
  OrderCancelledEvent,
  OrderStatus,
} from '@bgticketz/common';
import { ExpirationCompleteListener } from '../expiration-complete-listener.js';
import { Message } from 'node-nats-streaming';
import { getPublishedEventData } from './helper.js';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'jaska',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore

  const msg: Message = {
    ack: jest.fn(),
  };
  return {
    listener,
    order,
    ticket,
    data,
    msg,
  };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = getPublishedEventData<OrderCancelledEvent['data']>(
    natsWrapper.client.publish,
  );

  expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
