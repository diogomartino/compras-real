import { getCategories } from '../../db/queries/categories';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const listRoute = protectedProcedure.query(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(ctx, 'viewing categories');

  return getCategories(householdId);
});

export { listRoute };
