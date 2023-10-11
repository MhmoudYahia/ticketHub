import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@m-ticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Password } from '../services/passwords';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.route('/api/users/change-password').patch(
  requireAuth,
  [
    body('currentPassword')
      .not()
      .isEmpty()
      .withMessage('Please enter the current password'),
    body('newPassword')
      .trim()
      .isLength({ max: 20, min: 7 })
      .withMessage('user must enter a password between 7 and 20 chars '),
    body('newPasswordConfirm')
      .trim()
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('passwords must match'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const currentUser = await User.findById(req.currentUser?.id).select(
      'password'
    );
    if (!currentUser) {
      throw new NotFoundError();
    }

    const passwordMatch = await Password.compare(
      currentUser.password,
      currentPassword
    );
    if (!passwordMatch) throw new BadRequestError('Invalid Credentials');

    currentUser.set({ password: newPassword });
    await currentUser.save();

    const userToken = jwt.sign(
      {
        id: currentUser.id,
      },
      process.env.JWT_KEY!
    );

    // send jwt in the token
    req.session = {
      jwt: userToken,
    };

    res.status(200).json({ status: 'success' });
  }
);
export { router as changePasswordRouter };
