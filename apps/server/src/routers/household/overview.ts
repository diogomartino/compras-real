import { protectedProcedure } from '../../trpc';
import { buildHouseholdOverview } from './build-overview';

const overviewRoute = protectedProcedure.query(({ ctx }) =>
  buildHouseholdOverview(ctx.userId, ctx.user.activeHouseholdId)
);

export { overviewRoute };
