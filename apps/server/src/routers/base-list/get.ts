import { TRPCError } from '@trpc/server';
import z from 'zod';
import { getBaseListDetails } from '../../db/queries/base-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const getRoute = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .query(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'viewing a base list'
    );
    const baseList = await getBaseListDetails(householdId, input.id);

    if (!baseList) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Base list not found'
      });
    }

    return baseList;
  });

export { getRoute };
