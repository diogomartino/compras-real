import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createOngoingListItem } from '../../db/mutations/ongoing-list';
import { trackProductAddedToOngoing } from '../../db/mutations/product-usage-stats';
import { getBaseListById, getBaseListItems } from '../../db/queries/base-list';
import {
  getOngoingListDetails,
  getOngoingListItemForProduct
} from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { notifyShoppingUpdate } from '../../helpers/shopping-events';
import { protectedProcedure } from '../../trpc';
import { getOrCreateActiveOngoingList } from './helpers';

const addFromBaseListRoute = protectedProcedure
  .input(z.object({ baseListId: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'adding a list to the ongoing list'
    );

    const baseList = await getBaseListById(input.baseListId);

    if (!baseList || baseList.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'List not found' });
    }

    const baseListItems = await getBaseListItems(householdId, input.baseListId);
    const ongoingList = await getOrCreateActiveOngoingList(
      householdId,
      ctx.userId
    );

    for (const item of baseListItems) {
      const existingItem = await getOngoingListItemForProduct(
        ongoingList.id,
        item.productId
      );

      if (!existingItem) {
        // Preserve the list's own quantities rather than product defaults.
        await createOngoingListItem({
          householdId,
          ongoingListId: ongoingList.id,
          productId: item.productId,
          quantityAmount: item.quantityAmount,
          quantityUnit: item.quantityUnit,
          userId: ctx.userId
        });
        await trackProductAddedToOngoing({
          householdId,
          productId: item.productId
        });
      }
    }

    if (ongoingList.status === 'shopping') {
      await notifyShoppingUpdate({
        householdId,
        ongoingListId: ongoingList.id,
        type: 'item-updated'
      });
    }

    return getOngoingListDetails(householdId, ongoingList.id);
  });

export { addFromBaseListRoute };
