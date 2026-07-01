import z from 'zod';
import { updateCategory } from '../../db/mutations/categories';
import { getCategoryByName } from '../../db/queries/categories';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';
import { categoryInputSchema } from './schemas';

const updateRoute = protectedProcedure
  .input(
    categoryInputSchema.extend({
      id: z.uuid()
    })
  )
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'updating categories'
    );
    const existingCategory = await getCategoryByName(householdId, input.name);

    if (existingCategory && existingCategory.id !== input.id) {
      ctx.throwValidationError('name', 'Category already exists');
    }

    return updateCategory(input.id, { householdId, name: input.name });
  });

export { updateRoute };
