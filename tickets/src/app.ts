import express from 'express';
import 'express-async-errors'; // to use throw inside async functions
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@m-ticketing/common';
import { createTicketRouter } from './routes/new';

const app = express();
app.use(bodyParser.json());
app.set('trust proxy', true); // trust first proxy
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
