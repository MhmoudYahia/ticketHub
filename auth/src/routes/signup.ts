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
    body('gRecaptchaResponse')
      .isString()
      .notEmpty()
      .withMessage('Recaptcha response is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, name, gRecaptchaResponse } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('email in use');
    }

    const user = User.build({ email, password, name });
    await user.save();

    try {
      const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.ReCAPTCHA_SECRETKEY}&response=${gRecaptchaResponse}`;

      const response = await fetch(verificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (!result.success) {
          throw new BadRequestError('reCAPTCHA verification failed');
        }
      } else {
        throw new BadRequestError('Error in reCAPTCHA verification');
      }
    } catch (error) {
      console.error('Network error:', error);
    }

    const jwtuser = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: jwtuser,
    };

    res.status(201).json({ user });
  }
);

export { router as signupRouter };
