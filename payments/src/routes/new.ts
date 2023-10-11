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
import * as paypal from '../paypal';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.route('/api/payments').post(
  requireAuth,
  [
    // body('token').not().isEmpty().withMessage('token is required'),
    body('orderId').not().isEmpty().withMessage('orderId is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

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

    const { jsonResponse, httpStatusCode } = await paypal.createOrder(
      order.price
    );
    if (jsonResponse.status !== 'CREATED') {
      throw new BadRequestError('error creating order');
    }
    const paypalId = jsonResponse.id;
    console.log(httpStatusCode, paypalId);

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

    res.status(201).json({
      status: 'success',
      id: payment.id,
    });
  }
);

export { router as createChargeRouter };
