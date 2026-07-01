import type { TUnitKind } from '@myapp/shared';
import z from 'zod';

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

const quantityInputSchema = z
  .object({
    quantityAmount: z.number().positive(),
    quantityUnit: unitKindSchema
  })
  .transform((data) => ({
    quantityAmount: data.quantityAmount,
    quantityUnit: data.quantityUnit as TUnitKind
  }));

export { quantityInputSchema };
