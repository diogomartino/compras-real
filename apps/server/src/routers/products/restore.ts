import { TRPCError } from '@trpc/server';
import z from 'zod';
import { setProductArchived } from '../../db/mutations/products';
import { getCatalogProducts, getProductById } from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const restoreRoute = protectedProcedure
  .input(z.object({ id: z.uuid() }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getRequiredHouseholdId(ctx, 'restoring products');

    const product = await getProductById(input.id);

    if (!product || product.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    await setProductArchived(input.id, false);

    return getCatalogProducts(householdId);
  });

export { restoreRoute };
