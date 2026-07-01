import { createCategory } from '../../db/mutations/categories';
import { getCategoryByName } from '../../db/queries/categories';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';
import { categoryInputSchema } from './schemas';

const createRoute = protectedProcedure
  .input(categoryInputSchema)
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'creating categories'
    );
    const existingCategory = await getCategoryByName(householdId, input.name);

    if (existingCategory) {
      ctx.throwValidationError('name', 'Category already exists');
    }

    return createCategory({ householdId, name: input.name });
  });

export { createRoute };
