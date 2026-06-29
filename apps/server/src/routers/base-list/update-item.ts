import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateBaseListItem } from '../../db/mutations/base-list';
import {
  getBaseListDetails,
  getBaseListItemById
} from '../../db/queries/base-list';
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
      'updating base list items'
    );
    const item = await getBaseListItemById(input.id);

    if (!item || item.householdId !== householdId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Base list item not found'
      });
    }

    await updateBaseListItem(input.id, {
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit
    });

    return getBaseListDetails(householdId, item.baseListId);
  });

export { updateItemRoute };
