import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@m-ticketing/common';

const router = express.Router();

router.route('/api/tickets/:id').get(async (req: Request, res: Response) => {
  const { id } = req.params;

  const ticket = await Ticket.findById(id);
  if (!ticket) {
    throw new NotFoundError();
  }

  res.status(200).json({ ticket });
});

export { router as showTicketRouter };
