import z from 'zod';
import { reorderCategories } from '../../db/mutations/categories';
import { getCategories } from '../../db/queries/categories';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const reorderRoute = protectedProcedure
  .input(
    z.object({
      orderedIds: z.array(z.uuid()).min(1)
    })
  )
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'reordering categories'
    );

    await reorderCategories(householdId, input.orderedIds);

    return getCategories(householdId);
  });

export { reorderRoute };
