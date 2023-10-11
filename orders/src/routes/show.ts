import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@m-ticketing/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router
  .route('/api/orders/:orderId')
  .get(requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.status(200).json({ order });
  });

export { router as showOrderRouter };
