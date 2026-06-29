import { TRPCError } from '@trpc/server';
import z from 'zod';
import { removeBaseList } from '../../db/mutations/base-list';
import { getBaseListById, getBaseLists } from '../../db/queries/base-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const removeListRoute = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'removing base lists'
    );
    const baseList = await getBaseListById(input.id);

    if (!baseList || baseList.householdId !== householdId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Base list not found'
      });
    }

    await removeBaseList(input.id);

    return getBaseLists(householdId);
  });

export { removeListRoute };
