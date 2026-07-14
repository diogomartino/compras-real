import { TRPCError } from '@trpc/server';
import {
  removeHouseholdMember,
  setActiveHousehold
} from '../../db/mutations/households';
import {
  getMembership,
  getResolvedHouseholdIdForUser
} from '../../db/queries/households';
import { protectedProcedure } from '../../trpc';
import { buildHouseholdOverview } from './build-overview';

const leaveRoute = protectedProcedure.mutation(async ({ ctx }) => {
  const householdId = await getResolvedHouseholdIdForUser(
    ctx.userId,
    ctx.user.activeHouseholdId
  );

  if (!householdId) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'No active household' });
  }

  const membership = await getMembership(ctx.userId, householdId);

  if (!membership) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'You are not a member of this household'
    });
  }

  if (membership.role === 'owner') {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'The owner cannot leave their own household'
    });
  }

  await removeHouseholdMember(householdId, ctx.userId);

  // Point the user at a household they still belong to.
  const nextActive = await getResolvedHouseholdIdForUser(ctx.userId, null);

  if (nextActive) {
    await setActiveHousehold(ctx.userId, nextActive);
  }

  return buildHouseholdOverview(ctx.userId, nextActive);
});

export { leaveRoute };
