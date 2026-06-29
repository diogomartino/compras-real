import { TRPCError } from '@trpc/server';
import z from 'zod';
import { removeBaseListItem } from '../../db/mutations/base-list';
import {
  getBaseListDetails,
  getBaseListItemById
} from '../../db/queries/base-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const removeItemRoute = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'removing products from base lists'
    );
    const item = await getBaseListItemById(input.id);

    if (!item || item.householdId !== householdId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Base list item not found'
      });
    }

    await removeBaseListItem(input.id);

    return getBaseListDetails(householdId, item.baseListId);
  });

export { removeItemRoute };
