import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@m-ticketing/common';
import { User } from '../models/user';
import { Password } from '../services/passwords';
import jwt from 'jsonwebtoken';

const router = express.Router();

router
  .route('/api/users/signin')
  .post(
    [
      body('email').isEmail().withMessage('enter a valid email'),
      body('password').trim().notEmpty().withMessage('enter a password'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) throw new BadRequestError('Invalid Credentials');

      const passwordMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordMatch) throw new BadRequestError('Invalid Credentials');

      const userToken = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY!
      );

      // send jwt in the token
      req.session = {
        jwt: userToken,
      };

      res.status(201).json(existingUser);
    }
  );

export { router as signinRouter };
