import { TRPCError } from '@trpc/server';
import { getFirstHouseholdIdForUser } from '../db/queries/households';
import type { TProtectedContext } from '../trpc';

const getRequiredHouseholdId = async (
  ctx: TProtectedContext,
  action: string
) => {
  const householdId = await getFirstHouseholdIdForUser(ctx.userId);

  if (!householdId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `You must belong to a household before ${action}`
    });
  }

  return householdId;
};

export { getRequiredHouseholdId };
