import type { TPaginatedResult, TPaginationCursor } from '@myapp/shared';
import z from 'zod';

const paginationInputSchema = z
  .object({
    limit: z.number().int().min(1).max(50).optional(),
    cursor: z
      .object({
        id: z.string().min(1),
        value: z.number()
      })
      .optional()
  })
  .optional();

const getPaginationLimit = (limit: number | undefined, fallback = 20) =>
  limit ?? fallback;

const getPaginatedResult = <TItem>(
  items: TItem[],
  limit: number,
  getCursor: (item: TItem) => TPaginationCursor
): TPaginatedResult<TItem> => {
  const pageItems = items.slice(0, limit);
  const lastItem = pageItems.at(-1);

  return {
    items: pageItems,
    nextCursor: items.length > limit && lastItem ? getCursor(lastItem) : null
  };
};

export { getPaginatedResult, getPaginationLimit, paginationInputSchema };
export type { TPaginationCursor };
