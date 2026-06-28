import type { TUnitKind } from '@myapp/shared';
import z from 'zod';
import { createProduct } from '../../db/mutations/products';
import {
  getCatalogProducts,
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

const addRoute = protectedProcedure
  .input(
    z
      .object({
        title: z.string(),
        imageUrl: z.string().optional().nullable(),
        categoryName: z.string().optional().nullable(),
        defaultQuantityAmount: z.number().positive(),
        defaultQuantityUnit: unitKindSchema,
        sourceUrl: z.string().optional().nullable(),
        isArchived: z.boolean()
      })
      .transform((data) => ({
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

    const householdId = await getRequiredHouseholdId(ctx, 'creating products');
    const existingProduct = await getProductByTitle(householdId, input.title);

    if (existingProduct) {
      ctx.throwValidationError(
        'title',
        'A product with this name already exists'
      );
    }

    await createProduct({
      ...input,
      householdId,
      userId: ctx.userId
    });

    return getCatalogProducts(householdId);
  });

export { addRoute };
