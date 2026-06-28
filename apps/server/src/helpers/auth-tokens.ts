import jwt from 'jsonwebtoken';
import type { TTokenPayload } from '../types';

const JWT_ISSUER = 'myapp-server';
const JWT_AUDIENCE = 'myapp-client';
const JWT_EXPIRES_IN = '30d';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('Missing required environment variable: JWT_SECRET');
  }

  return process.env.JWT_SECRET;
};

const createAccessToken = (userId: string) => {
  return jwt.sign({ sub: userId }, getJwtSecret(), {
    algorithm: 'HS256',
    audience: JWT_AUDIENCE,
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER
  });
};

const verifyAccessToken = (token: string) => {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER
  }) as TTokenPayload | string;

  if (typeof payload === 'string' || !payload.exp) {
    return undefined;
  }

  return payload.sub || payload.userId;
};

export { createAccessToken, verifyAccessToken };
