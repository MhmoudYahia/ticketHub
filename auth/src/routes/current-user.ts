import express from 'express';
import { currentUser, requireAuth } from '@m-ticketing/common';

const router = express.Router();

router.route('/api/users/currentuser').get(currentUser, (req, res) => {
  res.status(200).json({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
