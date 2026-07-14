import { TRPCError } from '@trpc/server';
import z from 'zod';
import { removeHouseholdMember } from '../../db/mutations/households';
import {
  getMembership,
  getResolvedHouseholdIdForUser
} from '../../db/queries/households';
import { protectedProcedure } from '../../trpc';
import { buildHouseholdOverview } from './build-overview';

const removeMemberRoute = protectedProcedure
  .input(z.object({ userId: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getResolvedHouseholdIdForUser(
      ctx.userId,
      ctx.user.activeHouseholdId
    );

    if (!householdId) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active household' });
    }

    const myMembership = await getMembership(ctx.userId, householdId);

    if (myMembership?.role !== 'owner') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the household owner can remove members'
      });
    }

    if (input.userId === ctx.userId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'The owner cannot remove themselves'
      });
    }

    const targetMembership = await getMembership(input.userId, householdId);

    if (!targetMembership) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'This person is not a member'
      });
    }

    if (targetMembership.role === 'owner') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'The owner cannot be removed'
      });
    }

    await removeHouseholdMember(householdId, input.userId);

    return buildHouseholdOverview(ctx.userId, householdId);
  });

export { removeMemberRoute };
