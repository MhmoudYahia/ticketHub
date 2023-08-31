import express from 'express';
import { currentUser } from '../middlewares/current-user';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.route('/api/users/currentuser').get(currentUser, (req, res) => {
  res.status(200).json({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
