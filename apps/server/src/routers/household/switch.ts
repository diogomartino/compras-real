import { TRPCError } from '@trpc/server';
import z from 'zod';
import { setActiveHousehold } from '../../db/mutations/households';
import { getMembership } from '../../db/queries/households';
import { protectedProcedure } from '../../trpc';
import { buildHouseholdOverview } from './build-overview';

const switchRoute = protectedProcedure
  .input(z.object({ householdId: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const membership = await getMembership(ctx.userId, input.householdId);

    if (!membership) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'You are not a member of this household'
      });
    }

    await setActiveHousehold(ctx.userId, input.householdId);

    return buildHouseholdOverview(ctx.userId, input.householdId);
  });

export { switchRoute };
