import express from 'express';
import 'express-async-errors';
import { errorHandler, NotFoundError, currentUser } from '@bgticketz/common';

import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new.js';
import { showTicketRouter } from './routes/show.js';
import { indexTicketRouter } from './routes/index.js';
import { updateTicketRouter } from './routes/update.js';

const app = express();
app.set('trust proxy', true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
