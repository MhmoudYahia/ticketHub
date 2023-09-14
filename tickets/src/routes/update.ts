import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  validateRequest,
} from '@m-ticketing/common';
import { body } from 'express-validator';

const router = express.Router();

router
  .route('/api/tickets/:id')
  .put(
    requireAuth,
    [
      body('title').not().isEmpty().withMessage('title is required'),
      body('price')
        .isFloat({ gt: 0 })
        .withMessage('price is required and must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { title, price } = req.body;

      const ticket = await Ticket.findById(id);

      if (!ticket) {
        throw new NotFoundError();
      }

      if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      ticket.set({
        title,
        price,
      });
      await ticket.save();

      res.status(200).json({ ticket });
    }
  );

export { router as updateTicketRouter };
