import { jest } from '@jest/globals';
import type { AckHandlerCallback } from 'node-nats-streaming';

export const natsWrapper = {
  client: {
    publish: jest
      .fn<
        (
          subject: string,
          data?: string,
          callback?: AckHandlerCallback,
        ) => string
      >()
      .mockImplementation(
        (subject: string, data?: string, callback?: AckHandlerCallback) => {
          if (callback) callback(undefined, 'guid');
          return 'guid';
        },
      ),
  },
};
