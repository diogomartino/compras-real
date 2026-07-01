import { TRPCError } from '@trpc/server';
import z from 'zod';
import { removeOngoingListItem } from '../../db/mutations/ongoing-list';
import {
  getOngoingListDetails,
  getOngoingListItemById
} from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const removeItemRoute = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'removing ongoing list products'
    );
    const item = await getOngoingListItemById(input.id);

    if (!item || item.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    await removeOngoingListItem(input.id);

    return getOngoingListDetails(householdId, item.ongoingListId);
  });

export { removeItemRoute };
