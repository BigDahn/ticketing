import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  ValidateRequest,
  NotAuthorizedError,
  OrderStatus,
} from '@bgticketz/common';
import { Payment } from '../models/payment.js';
import { Order } from '../models/order.js';
import { stripe } from '../stripe.js';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-listener.js';
import { natsWrapper } from '../nats-wrapper.js';
const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('OrderId is required'),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100, // dollars to cents
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ id: payment.id });
  },
);

export { router as createChargeRouter };
