import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { User } from '../models/user';
import { BadRequestError,validateRequest } from '@m-ticketing/common';


const router = express.Router();

router
  .route('/api/users/signup')
  .post(
    [
      body('email').trim().isEmail().withMessage('user must has a valid email'),
      body('password')
        .trim()
        .isLength({ max: 20, min: 7 })
        .withMessage('user must enter a password between 7 and 20 chars '),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError('email in use');
      }

      const user = User.build({ email, password });
      await user.save();

      // Generate JWT
      const jwtuser = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!
      );

      // send jwt in the token
      req.session = {
        jwt: jwtuser,
      };

      res.status(201).json(user);
    }
  );

export { router as signupRouter };
