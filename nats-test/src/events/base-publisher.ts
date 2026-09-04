import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject']; // The publisher and the listener must have the same subject, so that the listener can listen to the events published by the publisher. This is important because it allows us to create a contract between the publisher and the listener, ensuring that they are both aware of the type of event being published and listened to. By enforcing this contract, we can prevent errors and ensure that our event-driven architecture works as expected.
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
