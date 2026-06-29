import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateBaseList } from '../../db/mutations/base-list';
import {
  getBaseListById,
  getBaseListByName,
  getBaseLists
} from '../../db/queries/base-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const updateListRoute = protectedProcedure
  .input(
    z
      .object({
        id: z.uuid(),
        name: z.string(),
        isEnabled: z.boolean()
      })
      .transform((data) => ({
        id: data.id,
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
      'updating base lists'
    );
    const baseList = await getBaseListById(input.id);

    if (!baseList || baseList.householdId !== householdId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Base list not found'
      });
    }

    const existingBaseList = await getBaseListByName(householdId, input.name);

    if (existingBaseList && existingBaseList.id !== input.id) {
      ctx.throwValidationError(
        'name',
        'A base list with this name already exists'
      );
    }

    await updateBaseList(input.id, {
      name: input.name,
      isEnabled: input.isEnabled
    });

    return getBaseLists(householdId);
  });

export { updateListRoute };
