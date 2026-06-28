import type { TUnitKind } from '@myapp/shared';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateProduct } from '../../db/mutations/products';
import {
  getCatalogProducts,
  getProductById,
  getProductByTitle
} from '../../db/queries/products';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { normalizeNull } from '../../helpers/normalize-null';
import { protectedProcedure } from '../../trpc';

const unitKindSchema = z.enum([
  'unit',
  'kg',
  'g',
  'liter',
  'ml',
  'pack',
  'bottle',
  'box',
  'other'
]);

const updateRoute = protectedProcedure
  .input(
    z
      .object({
        id: z.uuid(),
        title: z.string(),
        imageUrl: z.string().optional().nullable(),
        categoryName: z.string().optional().nullable(),
        defaultQuantityAmount: z.number().positive(),
        defaultQuantityUnit: unitKindSchema,
        sourceUrl: z.string().optional().nullable(),
        isArchived: z.boolean()
      })
      .transform((data) => ({
        id: data.id,
        title: data.title.trim(),
        imageUrl: normalizeNull(data.imageUrl),
        categoryName: normalizeNull(data.categoryName),
        defaultQuantityAmount: data.defaultQuantityAmount,
        defaultQuantityUnit: data.defaultQuantityUnit as TUnitKind,
        sourceUrl: normalizeNull(data.sourceUrl),
        isArchived: data.isArchived
      }))
  )
  .mutation(async ({ ctx, input }) => {
    if (!input.title) {
      ctx.throwValidationError('title', 'Product name is required');
    }

    const householdId = await getRequiredHouseholdId(ctx, 'updating products');
    const product = await getProductById(input.id);

    if (!product || product.householdId !== householdId) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    const existingProduct = await getProductByTitle(householdId, input.title);

    if (existingProduct && existingProduct.id !== input.id) {
      ctx.throwValidationError(
        'title',
        'A product with this name already exists'
      );
    }

    await updateProduct(input.id, {
      householdId,
      title: input.title,
      imageUrl: input.imageUrl,
      categoryName: input.categoryName,
      defaultQuantityAmount: input.defaultQuantityAmount,
      defaultQuantityUnit: input.defaultQuantityUnit,
      sourceUrl: input.sourceUrl,
      isArchived: input.isArchived,
      userId: ctx.userId
    });

    return getCatalogProducts(householdId);
  });

export { updateRoute };
