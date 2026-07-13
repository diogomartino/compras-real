import jwt from 'jsonwebtoken';
import type { TTokenPayload } from '../types';

const JWT_ISSUER = 'myapp-server';
const JWT_AUDIENCE = 'myapp-client';
const PASSWORD_RESET_AUDIENCE = 'myapp-password-reset';
const JWT_EXPIRES_IN = '30d';
const PASSWORD_RESET_EXPIRES_IN = '30m';

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

const createPasswordResetToken = (userId: string) => {
  return jwt.sign({ sub: userId }, getJwtSecret(), {
    algorithm: 'HS256',
    audience: PASSWORD_RESET_AUDIENCE,
    expiresIn: PASSWORD_RESET_EXPIRES_IN,
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

const verifyPasswordResetToken = (token: string) => {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ['HS256'],
    audience: PASSWORD_RESET_AUDIENCE,
    issuer: JWT_ISSUER
  }) as TTokenPayload | string;

  if (typeof payload === 'string' || !payload.exp || !payload.iat) {
    return undefined;
  }

  const userId = payload.sub || payload.userId;

  if (!userId) {
    return undefined;
  }

  return {
    userId,
    issuedAt: payload.iat
  };
};

export {
  createAccessToken,
  createPasswordResetToken,
  verifyAccessToken,
  verifyPasswordResetToken
};
