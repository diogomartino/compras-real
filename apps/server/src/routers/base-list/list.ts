import { getBaseLists } from '../../db/queries/base-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const listRoute = protectedProcedure.query(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(ctx, 'viewing base lists');

  return getBaseLists(householdId);
});

export { listRoute };
