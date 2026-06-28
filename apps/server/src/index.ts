import { loadDb } from '@myapp/db';
import { logger } from '@myapp/logger';
import { TRPCError } from '@trpc/server';
import type { TRPCRequestInfo } from '@trpc/server/http';
import { createBunWSHandler, type BunWSClientCtx } from 'trpc-bun-adapter';
import { getUserById } from './db/queries/users';
import { verifyAccessToken } from './helpers/auth-tokens';
import { MIGRATIONS_PATH } from './helpers/paths';
import { requireEnv } from './helpers/require-env';
import { appRouter, type AppRouter } from './routers';
import type { TProtectedContext, TTRPCContext } from './trpc';

logger.info('Starting server...');

const port = Number(requireEnv('PORT'));
const CLIENT_ORIGIN = new URL(requireEnv('CLIENT_URL')).origin;

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

    try {
      const verifiedUserId = verifyAccessToken(token);

      if (!verifiedUserId) {
        return unauthorizedState;
      }

      userId = verifiedUserId;
    } catch {
      return unauthorizedState;
    }

    const user = await getUserById(userId);

    if (!user) {
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
  // onError: console.error,
  batching: {
    enabled: true
  }
});

Bun.serve({
  port: port,
  fetch(request, server) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

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
