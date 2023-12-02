import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@m-ticketing/common';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user';

const router = express.Router();

async function getUserData(access_token: string) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const userData = await response.json();
  return userData;
}

const createOAuth2Client = () => {
  const redirectUrl = 'https://ticketing.dev/api/users/auth/google/callback';

  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID_GOOGLE,
    process.env.CLIENT_SECRET_GOOGLE,
    redirectUrl
  );

  return oAuth2Client;
};

router
  .route('/api/users/requestOauth-google')
  .post((req: Request, res: Response) => {
    const oAuth2Client = createOAuth2Client();

    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid ',
      prompt: 'consent',
    });

    res.json({ url: authorizeUrl });
  });

router
  .route('/api/users/auth/google/callback')
  .get(async (req: Request, res: Response) => {
    const code = req.query.code as string;

    try {
      const oAuth2Client = createOAuth2Client();

      const response = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(response.tokens);
      const userData = await getUserData(
        oAuth2Client.credentials.access_token as string
      );

      const user = await User.findOne({ email: userData.email });
      if (!user) {
        res.redirect(303, 'https://ticketing.dev/auth/signup');
        throw new BadRequestError('go to signup');
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
      res.redirect(303, 'https://ticketing.dev/');
    } catch (err) {
      console.log('Error logging in with OAuth2 user', err);
    }
  });

export { router as googleOauthRouter };
