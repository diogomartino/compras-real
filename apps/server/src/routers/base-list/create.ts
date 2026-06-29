import z from 'zod';
import { createBaseList } from '../../db/mutations/base-list';
import { getBaseListByName, getBaseLists } from '../../db/queries/base-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const createRoute = protectedProcedure
  .input(
    z
      .object({
        name: z.string(),
        isEnabled: z.boolean()
      })
      .transform((data) => ({
        name: data.name.trim(),
        isEnabled: data.isEnabled
      }))
  )
  .mutation(async ({ ctx, input }) => {
    if (!input.name) {
      ctx.throwValidationError('name', 'Base list name is required');
    }

    const householdId = await getRequiredHouseholdId(
      ctx,
      'creating base lists'
    );
    const existingBaseList = await getBaseListByName(householdId, input.name);

    if (existingBaseList) {
      ctx.throwValidationError(
        'name',
        'A base list with this name already exists'
      );
    }

    await createBaseList({
      householdId,
      name: input.name,
      isEnabled: input.isEnabled,
      userId: ctx.userId
    });

    return getBaseLists(householdId);
  });

export { createRoute };
