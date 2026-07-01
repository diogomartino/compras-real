import type { TOngoingListItemStatus } from '@myapp/shared';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { setShoppingItemStatus } from '../../db/mutations/shopping';
import { getOngoingListItemById } from '../../db/queries/ongoing-list';
import { getShoppingListDetails } from '../../db/queries/shopping';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { notifyShoppingUpdate } from '../../helpers/shopping-events';
import { protectedProcedure } from '../../trpc';

const itemStatusSchema = z.enum(['pending', 'checked', 'ignored', 'discarded']);

const setItemStatusRoute = protectedProcedure
  .input(
    z.object({
      id: z.uuid(),
      status: itemStatusSchema
    })
  )
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'updating shopping products'
    );
    const item = await getOngoingListItemById(input.id);

    if (!item || item.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    await setShoppingItemStatus(
      input.id,
      input.status as TOngoingListItemStatus,
      ctx.userId
    );
    await notifyShoppingUpdate({
      householdId,
      ongoingListId: item.ongoingListId,
      type: 'item-updated'
    });

    return getShoppingListDetails(householdId, item.ongoingListId);
  });

export { setItemStatusRoute };
