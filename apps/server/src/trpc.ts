import { logger } from '@myapp/logger';
import type { TUser } from '@myapp/shared';
import { initTRPC, TRPCError } from '@trpc/server';
import chalk from 'chalk';
import superjson from 'superjson';

type TTRPCContext = {
  authenticated: boolean;
  userId: string | undefined;
  user: TUser | undefined;
  throwValidationError: (field: string, message: string) => never;
};

type TProtectedContext = TTRPCContext & {
  authenticated: true;
  user: TUser;
  userId: string;
};

const t = initTRPC.context<TTRPCContext>().create({ transformer: superjson });

const publicProcedure = t.procedure.use(async ({ path, next }) => {
  const start = performance.now();
  const result = await next();
  const end = performance.now();
  const duration = end - start;

  logger.debug(
    `${chalk.dim('[tRPC]')} ${chalk.yellow(path)} took ${chalk.green(duration.toFixed(2))} ms`
  );

  return result;
});

const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.authenticated || !ctx.user || !ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    });
  }

  const protectedCtx: TProtectedContext = {
    authenticated: true,
    userId: ctx.userId,
    user: ctx.user,
    throwValidationError: ctx.throwValidationError
  };

  return next({
    ctx: protectedCtx
  });
});

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user.isAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to access this resource'
    });
  }

  return next();
});

export { adminProcedure, protectedProcedure, publicProcedure, t };
export type { TProtectedContext, TTRPCContext };
