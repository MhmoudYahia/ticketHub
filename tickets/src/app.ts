import express from 'express';
import 'express-async-errors'; // to use throw inside async functions
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@m-ticketing/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();
app.use(bodyParser.json());
app.set('trust proxy', true); // trust first proxy
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);
app.use(indexRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
