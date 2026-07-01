import z from 'zod';
import { getFinishedOngoingListHistory } from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const historyRoute = protectedProcedure
  .input(
    z
      .object({
        limit: z.number().int().min(1).max(50).optional()
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'viewing shopping history'
    );

    return getFinishedOngoingListHistory(householdId, input?.limit ?? 20);
  });

export { historyRoute };
