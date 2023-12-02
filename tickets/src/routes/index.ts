import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.route('/api/tickets').get(async (req: Request, res: Response) => {
  const tickets = await Ticket.find({ orderId: undefined });

  res.status(200).json({ tickets });
});

export { router as indexRouter };
