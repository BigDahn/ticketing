import jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, ValidateRequest } from '@bgticketz/common';
import { Password } from '../services/password.js';

import { User } from '../models/user.js';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be provided'),
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    // generate JWT store it on session object

    const userJwt = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );
    console.log(userJwt);
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
