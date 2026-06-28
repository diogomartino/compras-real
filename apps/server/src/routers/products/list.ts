import { getCatalogProducts } from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const listRoute = protectedProcedure.query(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(ctx, 'viewing products');

  return getCatalogProducts(householdId);
});

export { listRoute };
