import express from 'express';
import { currentUser, requireAuth } from '@m-ticketing/common';
import { User } from '../models/user';

const router = express.Router();

router.route('/api/users/currentuser').get(async (req, res) => {
  const currentUser = await User.findById(req.currentUser?.id);

  res.status(200).json({ currentUser: currentUser || null });
});

export { router as currentUserRouter };
