import express from 'express';
import 'express-async-errors';
import { errorHandler, NotFoundError, currentUser } from '@bgticketz/common';

import cookieSession from 'cookie-session';

import { deleteOrderRouter } from './routes/delete.js';
import { newOrderRouter } from './routes/new.js';
import { indexOrderRouter } from './routes/index.js';
import { showOrderRouter } from './routes/show.js';

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

app.use(deleteOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
