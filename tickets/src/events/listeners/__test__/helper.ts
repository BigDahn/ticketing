import type { AckHandlerCallback } from 'node-nats-streaming';

type PublishMock = jest.Mock<
  (subject: string, data?: string, callback?: AckHandlerCallback) => string
>;

export function getPublishedEventData<T = unknown>(mockPublish: unknown): T {
  return JSON.parse(
    (mockPublish as PublishMock).mock.calls[0][1] as string,
  ) as T;
}
