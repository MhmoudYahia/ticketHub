import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@m-ticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router
  .route('/api/tickets')
  .post(
    requireAuth,
    [
      body('title').not().isEmpty().withMessage('ticket must have a title'),
      body('price').isFloat({ gt: 0 }).withMessage('price must be gt 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { title, price } = req.body;

      const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id,
      });
      await ticket.save();

      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });

      res.status(201).json({ ticket });
    }
  );

export { router as createTicketRouter };
