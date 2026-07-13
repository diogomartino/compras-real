import type { TOngoingListItemStatus } from '@myapp/shared';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { trackProductShoppingStatus } from '../../db/mutations/product-usage-stats';
import { setShoppingItemStatus } from '../../db/mutations/shopping';
import { getOngoingListItemById } from '../../db/queries/ongoing-list';
import { getProductById } from '../../db/queries/products';
import {
  getShoppingListDetails,
  getShoppingOngoingList
} from '../../db/queries/shopping';
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

    const shoppingList = await getShoppingOngoingList(householdId);

    if (!shoppingList || shoppingList.id !== item.ongoingListId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    const product = await getProductById(item.productId);

    await setShoppingItemStatus({
      itemId: input.id,
      householdId,
      ongoingListId: item.ongoingListId,
      status: input.status as TOngoingListItemStatus,
      userId: ctx.userId
    });
    await trackProductShoppingStatus({
      householdId,
      productId: item.productId,
      status: input.status as TOngoingListItemStatus
    });
    if (input.status === 'pending') {
      await notifyShoppingUpdate({
        householdId,
        ongoingListId: item.ongoingListId,
        type: 'item-updated'
      });
    } else {
      await notifyShoppingUpdate({
        householdId,
        ongoingListId: item.ongoingListId,
        type: 'activity',
        actor: {
          id: ctx.user.id,
          name: ctx.user.name,
          avatarUrl: ctx.user.avatarUrl
        },
        product: {
          id: item.productId,
          title: product?.title ?? 'Product'
        },
        status: input.status as Exclude<TOngoingListItemStatus, 'pending'>,
        createdAt: Date.now()
      });
    }

    return getShoppingListDetails(householdId, item.ongoingListId);
  });

export { setItemStatusRoute };
