import z from 'zod';
import { getSuggestedProducts } from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const suggestionsRoute = protectedProcedure
  .input(
    z
      .object({
        limit: z.number().int().min(1).max(24).optional()
      })
      .optional()
  )
  .query(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'viewing suggested products'
    );

    return getSuggestedProducts(householdId, input?.limit ?? 8);
  });

export { suggestionsRoute };
