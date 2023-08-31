import express from 'express';

const router = express.Router();

router.route('/api/users/signout').post((req, res) => {
  req.session = null;

  res.status(200).json({ message: 'Signed out' });
});

export { router as signoutRouter };
