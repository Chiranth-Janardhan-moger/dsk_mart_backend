import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = ENV.JWT_SECRET as Secret;
  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN,
  };
  
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = ENV.JWT_SECRET as Secret;
  return jwt.verify(token, secret) as TokenPayload;
};