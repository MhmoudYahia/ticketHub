import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@m-ticketing/common';
import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dgvfbngc7',
  api_key: '293821165245441',
  api_secret: 'BBsorWKN4DRuXnKyIfxxyggR-is',
});

const uploadToCloudinary = async (file: any) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

const multer = require('multer');
import sharp from 'sharp';
import { User } from '../models/user';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    throw new BadRequestError('upload an image file');
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadPhoto = upload.single('photo');

interface MulterRequest extends Request {
  file: any;
}

const resizePhoto = async (req: Request, res: Response, next: NextFunction) => {
  if (!(req as MulterRequest).file) return next();

  const newBuffer = sharp((req as MulterRequest).file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 });

  const b64 = Buffer.from((req as MulterRequest).file.buffer).toString(
    'base64'
  );
  let dataURI =
    'data:' + (req as MulterRequest).file.mimetype + ';base64,' + b64;
  const cldRes = await uploadToCloudinary(dataURI);
  console.log(cldRes);

  res.locals.fileUrl = cldRes;
  next();
};

router.route('/api/users/update-current-user').patch(
  requireAuth,
  uploadPhoto,
  resizePhoto,
  [
    body('name').trim().isString().withMessage('name is letters only'),
    body('email').trim().isEmail().withMessage('enter a valid email address'),
    body('jobTitle').trim().isString().withMessage('job name is letters only'),
    body('phone')
      .matches(/^\d{11}$/)
      .withMessage('enter a valid phone number'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, phone, jobTitle } = req.body;

    const currentUser = await User.findById(req.currentUser?.id);

    if (!currentUser) {
      throw new NotFoundError();
    }

    currentUser.set({
      name,
      email,
      phone: phone.toString(),
      jobTitle,
    });
    if ((req as MulterRequest).file) {
      currentUser.photo = res.locals.fileUrl;
    }
    await currentUser.save();
    console.log(currentUser);

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

    res.status(200).json({ status: 'success', data: { currentUser } });
  }
);

export { router as updateCurrentUserRouter };
