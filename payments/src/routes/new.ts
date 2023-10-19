import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@m-ticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import * as paypal from '../../utils/paypal';

const router = express.Router();

router
  .route('/api/payments')
  .post(
    requireAuth,
    [
      body('paypalId').not().isEmpty().withMessage('paypal id is required'),
      body('orderId').not().isEmpty().withMessage('orderId is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { orderId, paypalId } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError();
      }
      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      if (order.status == OrderStatus.Cancelled) {
        throw new BadRequestError("can't pay a cancelled order");
      }
      if (order.status == OrderStatus.Complete) {
        throw new BadRequestError("can't pay a complete order");
      }

      const payment = Payment.build({
        orderId: order.id,
        paypalId,
      });
      await payment.save();

      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: order.id,
        paypalId,
      });
      order.set({ status: OrderStatus.Complete });
      await order.save();

      res.status(201).json({
        status: 'success',
        id: payment.id,
      });
    }
  );

export { router as createChargeRouter };
