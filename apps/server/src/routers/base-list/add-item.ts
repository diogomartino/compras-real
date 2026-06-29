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

const addItemRoute = protectedProcedure
  .input(
    quantityInputSchema.and(
      z.object({
        baseListId: z.uuid(),
        productId: z.uuid()
      })
    )
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

    const product = await getProductById(input.productId);

    if (!product || product.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    const existingBaseItem = await getBaseListItemForProduct(
      input.baseListId,
      input.productId
    );

    if (existingBaseItem) {
      ctx.throwValidationError(
        'productId',
        'This product is already in this base list'
      );
    }

    await createBaseListItem({
      householdId,
      baseListId: input.baseListId,
      productId: input.productId,
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit,
      userId: ctx.userId
    });

    return getBaseListDetails(householdId, input.baseListId);
  });

export { addItemRoute };
