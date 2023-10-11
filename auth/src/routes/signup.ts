import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError, validateRequest } from '@m-ticketing/common';

const router = express.Router();

router.route('/api/users/signup').post(
  [
    body('name')
      .trim()
      .matches(new RegExp(/^[a-zA-Z\s]+$/))
      .withMessage('name is not valid. Please use only letters'),
    body('email').trim().isEmail().withMessage('user must has a valid email'),
    body('password')
      .trim()
      .isLength({ max: 20, min: 7 })
      .withMessage('user must enter a password between 7 and 20 chars '),
    body('passwordConfirm')
      .trim()
      .custom((value, { req }) => value === req.body.password)
      .withMessage('passwords must match'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, passwordConfirm, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('email in use');
    }

    const user = User.build({ email, password, name });
    await user.save();

    // Generate JWT
    const jwtuser = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_KEY!
    );

    // send jwt in the token
    req.session = {
      jwt: jwtuser,
    };

    res.status(201).json({ user });
  }
);

export { router as signupRouter };

