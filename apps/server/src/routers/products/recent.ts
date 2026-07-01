import z from 'zod';
import { getRecentCatalogProducts } from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const recentRoute = protectedProcedure
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
      'viewing recent products'
    );

    return getRecentCatalogProducts(householdId, input?.limit ?? 12);
  });

export { recentRoute };
