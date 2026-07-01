import z from 'zod';
import { deleteCategory } from '../../db/mutations/categories';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const deleteRoute = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'deleting categories'
    );

    return deleteCategory(householdId, input.id);
  });

export { deleteRoute };
