import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@m-ticketing/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
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

      res.status(201).json({ ticket });
    }
  );

export { router as createTicketRouter };
