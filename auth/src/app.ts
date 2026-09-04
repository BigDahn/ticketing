import express from 'express';
import 'express-async-errors';
import { errorHandler, NotFoundError } from '@bgticketz/common';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user.js';
import { signinRouter } from './routes/signin.js';
import { signupRouter } from './routes/signup.js';
import { signoutRouter } from './routes/signout.js';

const app = express();
app.set('trust proxy', true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
