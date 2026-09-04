import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@bgticketz/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
