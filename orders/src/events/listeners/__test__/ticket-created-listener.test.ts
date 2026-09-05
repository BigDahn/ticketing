import { TicketCreatedEvent } from '@bgticketz/common';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener.js';
import { natsWrapper } from '../../../nats-wrapper.js';
import { Message } from 'node-nats-streaming';
import { jest } from '@jest/globals';
import { Ticket } from '../../../models/ticket.js';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 300,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
};

it('created and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object

  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called

  expect(msg.ack).toHaveBeenCalled();
});
