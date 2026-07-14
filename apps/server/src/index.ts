import { loadDb } from '@myapp/db';
import { logger } from '@myapp/logger';
import { TRPCError } from '@trpc/server';
import type { TRPCRequestInfo } from '@trpc/server/http';
import { createBunWSHandler, type BunWSClientCtx } from 'trpc-bun-adapter';
import { createUserWithHousehold } from './db/mutations/users';
import { getUserByEmail, getUserById } from './db/queries/users';
import { createAccessToken, verifyAccessToken } from './helpers/auth-tokens';
import {
  getGoogleAccessToken,
  getGoogleAuthUrl,
  getGoogleUserInfo
} from './helpers/google-oauth';
import { MIGRATIONS_PATH } from './helpers/paths';
import { requireEnv } from './helpers/require-env';
import { appRouter, type AppRouter } from './routers';
import type { TProtectedContext, TTRPCContext } from './trpc';

logger.info('Starting server...');

const port = Number(requireEnv('PORT'));
const CLIENT_ORIGIN = new URL(requireEnv('CLIENT_URL')).origin;
const CLIENT_URL = requireEnv('CLIENT_URL');
const GOOGLE_STATE_COOKIE = 'google_oauth_state';

const getBearerToken = (value: string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  const [scheme, token] = value.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return undefined;
  }

  return token;
};

const getTokenFromRequest = (req: Request, info: TRPCRequestInfo) => {
  const connectionParams = info.connectionParams;

  return (
    getBearerToken(connectionParams?.authorization) ||
    connectionParams?.token ||
    getBearerToken(req.headers.get('Authorization'))
  );
};

const getCookieValue = (request: Request, name: string) => {
  const cookie = request.headers.get('Cookie');

  if (!cookie) {
    return undefined;
  }

  return cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
};

const getGoogleRedirectUri = (request: Request) => {
  return new URL('/auth/google/callback', request.url).toString();
};

const getOAuthCookieAttributes = (request: Request) => {
  const secure =
    new URL(request.url).hostname === 'localhost' ? '' : '; Secure';

  return `HttpOnly; Path=/auth/google; SameSite=Lax; Max-Age=600${secure}`;
};

const redirectToClientAuthCallback = (params: Record<string, string>) => {
  const url = new URL('/auth/google/callback', CLIENT_URL);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return Response.redirect(url.toString(), 302);
};

const redirectToClientAuthSuccess = (token: string) => {
  const url = new URL('/auth/google/callback', CLIENT_URL);

  url.hash = new URLSearchParams({ token }).toString();

  return Response.redirect(url.toString(), 302);
};

const handleGoogleStart = (request: Request) => {
  const state = crypto.randomUUID();
  const redirectUri = getGoogleRedirectUri(request);
  const response = Response.redirect(getGoogleAuthUrl(state, redirectUri), 302);

  response.headers.set(
    'Set-Cookie',
    `${GOOGLE_STATE_COOKIE}=${state}; ${getOAuthCookieAttributes(request)}`
  );

  return response;
};

const handleGoogleCallback = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = getCookieValue(request, GOOGLE_STATE_COOKIE);

  if (!code || !state || !storedState || state !== storedState) {
    return redirectToClientAuthCallback({
      error: 'Invalid Google login state'
    });
  }

  try {
    const accessToken = await getGoogleAccessToken(
      code,
      getGoogleRedirectUri(request)
    );
    const googleUser = await getGoogleUserInfo(accessToken);
    const email = googleUser.email.trim().toLowerCase();
    const existingUser = await getUserByEmail(email);
    const now = Date.now();
    const user =
      existingUser ??
      (await createUserWithHousehold(
        {
          name: googleUser.name?.trim() || email,
          email,
          passwordHash: await Bun.password.hash(crypto.randomUUID()),
          avatarUrl: googleUser.picture,
          createdAt: now,
          updatedAt: now
        },
        `${googleUser.name?.trim() || email}'s household`,
        now
      ));
    const response = redirectToClientAuthSuccess(createAccessToken(user.id));

    response.headers.set(
      'Set-Cookie',
      `${GOOGLE_STATE_COOKIE}=; Path=/auth/google; HttpOnly; SameSite=Lax; Max-Age=0`
    );

    return response;
  } catch (error) {
    return redirectToClientAuthCallback({
      error: error instanceof Error ? error.message : 'Google login failed'
    });
  }
};

await loadDb({
  runMigrations: true,
  migrationsFolder: MIGRATIONS_PATH,
  database: requireEnv('POSTGRES_DB'),
  user: requireEnv('POSTGRES_USER'),
  password: requireEnv('POSTGRES_PASSWORD'),
  host: requireEnv('POSTGRES_HOST'),
  port: Number(requireEnv('POSTGRES_PORT'))
});

const websocket = createBunWSHandler({
  router: appRouter,
  createContext: async ({ info, req }) => {
    const throwValidationError = (field: string, message: string) => {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: JSON.stringify([
          {
            code: 'custom',
            path: [field],
            message
          }
        ])
      });
    };

    const token = getTokenFromRequest(req, info);

    const unauthorizedState: TTRPCContext = {
      authenticated: false,
      userId: undefined,
      user: undefined,
      throwValidationError
    };

    if (!token) {
      return unauthorizedState;
    }

    let userId: string;
    let issuedAt: number;

    try {
      const verified = verifyAccessToken(token);

      if (!verified) {
        return unauthorizedState;
      }

      userId = verified.userId;
      issuedAt = verified.issuedAt;
    } catch {
      return unauthorizedState;
    }

    const user = await getUserById(userId);

    if (!user) {
      return unauthorizedState;
    }

    if (
      user.passwordChangedAt &&
      issuedAt < Math.floor(user.passwordChangedAt / 1000)
    ) {
      return unauthorizedState;
    }

    const authenticatedState: TProtectedContext = {
      authenticated: true,
      userId,
      user,
      throwValidationError
    };

    return authenticatedState;
  },
  batching: {
    enabled: true
  }
});

Bun.serve({
  port: port,
  fetch(request, server) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (url.pathname === '/auth/google') {
      return handleGoogleStart(request);
    }

    if (url.pathname === '/auth/google/callback') {
      return handleGoogleCallback(request);
    }

    if (url.pathname !== '/trpc') {
      return new Response('Not found', { status: 404 });
    }

    if (origin && origin !== CLIENT_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    const data = {
      req: request
    } as BunWSClientCtx<AppRouter>;

    if (server.upgrade(request, { data })) {
      return;
    }

    return new Response('Please use websocket protocol', { status: 404 });
  },
  websocket
});

logger.info(`Server started on port ${port}`);
