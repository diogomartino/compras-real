import type { TUnitKind } from '@myapp/shared';
import z from 'zod';
import { createOngoingListItem } from '../../db/mutations/ongoing-list';
import {
  getOngoingListDetails,
  getOngoingListItemForProduct
} from '../../db/queries/ongoing-list';
import { getProductById } from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';
import { getOrCreateActiveOngoingList } from './helpers';

const addItemsRoute = protectedProcedure
  .input(
    z.object({
      productIds: z.array(z.uuid()).min(1)
    })
  )
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'adding products to the ongoing list'
    );
    const ongoingList = await getOrCreateActiveOngoingList(
      householdId,
      ctx.userId
    );

    if (ongoingList.status === 'shopping') {
      ctx.throwValidationError(
        'productIds',
        'Products cannot be added while shopping mode is active'
      );
    }

    const uniqueProductIds = Array.from(new Set(input.productIds));

    for (const productId of uniqueProductIds) {
      const product = await getProductById(productId);

      if (!product || product.householdId !== householdId) {
        ctx.throwValidationError('productIds', 'Invalid product selected');
        continue;
      }

      const existingItem = await getOngoingListItemForProduct(
        ongoingList.id,
        productId
      );

      if (!existingItem) {
        await createOngoingListItem({
          householdId,
          ongoingListId: ongoingList.id,
          productId,
          quantityAmount: product.defaultQuantityAmount,
          quantityUnit: product.defaultQuantityUnit as TUnitKind,
          userId: ctx.userId
        });
      }
    }

    return getOngoingListDetails(householdId, ongoingList.id);
  });

export { addItemsRoute };
