import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import * as paypal from '../../utils/paypal';
import { BadRequestError, validateRequest } from '@m-ticketing/common';

const router = express.Router();

router
  .route('/api/payments/create-order')
  .post(
    [body('price').not().isEmpty().withMessage('price not found')],
    validateRequest,
    async (req: Request, res: Response) => {
      const { price } = req.body;
      try {
        const { jsonResponse, httpStatusCode } = await paypal.createOrder(
          price
        );
        res.status(httpStatusCode).json(jsonResponse);
      } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).json({ error: 'Failed to create order.' });
      }
    }
  );

router
  .route('/api/payments/:paypalId/capture')
  .post(async (req: Request, res: Response) => {
    try {
      const { paypalId } = req.params;
      const { jsonResponse, httpStatusCode } = await paypal.captureOrder(
        paypalId
      );
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error('Failed to create order:', error);
      res.status(500).json({ error: 'Failed to capture order.' });
    }
  });

export { router as paypalRouter };
