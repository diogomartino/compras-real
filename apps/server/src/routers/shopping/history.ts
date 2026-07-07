import { getFinishedOngoingListHistory } from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { getPaginationLimit, paginationInputSchema } from '../../helpers/pagination';
import { protectedProcedure } from '../../trpc';

const historyRoute = protectedProcedure
  .input(paginationInputSchema)
  .query(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'viewing shopping history'
    );

    return getFinishedOngoingListHistory(
      householdId,
      getPaginationLimit(input?.limit),
      input?.cursor
    );
  });

export { historyRoute };
