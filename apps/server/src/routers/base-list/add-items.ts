import { TRPCError } from '@trpc/server';
import z from 'zod';
import { createBaseListItem } from '../../db/mutations/base-list';
import {
  getBaseListById,
  getBaseListDetails,
  getBaseListItemForProduct
} from '../../db/queries/base-list';
import { getProductById } from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';
import { quantityInputSchema } from './schemas';

const itemSchema = z.object({ productId: z.uuid() }).and(quantityInputSchema);

const addItemsRoute = protectedProcedure
  .input(
    z.object({
      baseListId: z.uuid(),
      items: z.array(itemSchema).min(1)
    })
  )
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(
      ctx,
      'adding products to base lists'
    );
    const baseList = await getBaseListById(input.baseListId);

    if (!baseList || baseList.householdId !== householdId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Base list not found'
      });
    }

    for (const item of input.items) {
      const product = await getProductById(item.productId);

      if (!product || product.householdId !== householdId) {
        ctx.throwValidationError('items', 'Invalid product selected');
        continue;
      }

      const existingBaseItem = await getBaseListItemForProduct(
        input.baseListId,
        item.productId
      );

      if (existingBaseItem) {
        continue;
      }

      await createBaseListItem({
        householdId,
        baseListId: input.baseListId,
        productId: item.productId,
        quantityAmount: item.quantityAmount,
        quantityUnit: item.quantityUnit,
        userId: ctx.userId
      });
    }

    return getBaseListDetails(householdId, input.baseListId);
  });

export { addItemsRoute };
