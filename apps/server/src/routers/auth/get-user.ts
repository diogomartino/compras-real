import { publicProcedure } from '../../trpc';

const getUserRoute = publicProcedure.query(({ ctx }) => {
  return ctx.user;
});

export { getUserRoute };
