import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateOngoingListItem } from '../../db/mutations/ongoing-list';
import {
  getOngoingListDetails,
  getOngoingListItemById
} from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';
import { quantityInputSchema } from './schemas';

const updateItemRoute = protectedProcedure
  .input(
    quantityInputSchema.and(
      z.object({
        id: z.uuid()
      })
    )
  )
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'updating ongoing list products'
    );
    const item = await getOngoingListItemById(input.id);

    if (!item || item.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    await updateOngoingListItem(input.id, {
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit
    });

    return getOngoingListDetails(householdId, item.ongoingListId);
  });

export { updateItemRoute };
