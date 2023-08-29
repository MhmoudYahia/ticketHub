import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').trim().isEmail().withMessage('user must has a valid email'),
    body('password')
      .trim()
      .isLength({ max: 20, min: 7 })
      .withMessage('user must enter a password between 7 and 20 chars '),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('email in use');
    }

    const user = User.build({ email, password });
    await user.save();

    res.status(201).json(user);
  }
);

export { router as signupRouter };
