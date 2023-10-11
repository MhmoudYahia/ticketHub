import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@m-ticketing/common';
import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router
  .route('/api/orders/:orderId')
  .delete(requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // update the status to cancelled
    order.status = OrderStatus.Cancelled;
    await order.save();

    //publish the event
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).json({ order });
  });

export { router as deleteOrderRouter };
