import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

// An interface is a way to define the shape of an object in TypeScript. In this case, the Event interface defines the shape of an event object that has a subject property of type Subjects and a data property of any type. This allows us to create listeners for different types of events, while still enforcing that they have the required properties.

interface Event {
  subject: Subjects;
  data: any;
}

// The extends Event part is a generic constraint that ensures that the type T must have a subject property of type Subjects and a data property of any type. This allows us to create listeners for different types of events, while still enforcing that they have the required properties.

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']; // The subject of the event that this listener is listening to.
  abstract queueGroupName: string; // The queue group name for this listener, used for load balancing and message delivery. Each listener in the same queue group will receive a copy of the message, but only one listener in the group will process it. If a listener in the group fails to process the message, it will be re-delivered to another listener in the group.
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000; // 5 secs to wait before acking the message, if not acked, it will be re-delivered to the queue group

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOPtions() {
    return this.client
      .subscriptionOptions() // make sure to use subscriptionOptions() to set the options for the subscription. This is important because it allows you to configure how the listener behaves, such as whether it should deliver all available messages, whether it should use manual ack mode, and how long to wait before acking the message.

      .setDeliverAllAvailable() // deliver all available messages to the listener, even if they were published before the listener was created. This is useful for listeners that need to process all events, even if they were published before the listener was created.

      .setManualAckMode(true) // change to manual ack mode, so that the listener can control when to ack the message. If not acked, it will be re-delivered to the queue group.

      .setAckWait(this.ackWait) // set the time to wait before acking the message, if not acked, it will be re-delivered to the queue group

      .setDurableName(this.queueGroupName); // Durable name is used to keep track of the last acknowledged message for this listener, so that if the listener goes down and comes back up, it can continue from where it left off.
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOPtions(),
    ); // create a subscription to the subject and queue group name, and use the subscription options to configure the listener behavior.

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject}/${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }
  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
