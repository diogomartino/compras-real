import { TRPCError } from '@trpc/server';
import z from 'zod';
import { enforceRateLimit } from '../../helpers/rate-limit';
import { scrapSearch } from '../../scrappers';
import { protectedProcedure } from '../../trpc';

const searchRoute = protectedProcedure
  .input(
    z
      .object({
        query: z.string()
      })
      .transform((data) => ({
        query: data.query.trim().slice(0, 100)
      }))
  )
  .query(async ({ ctx, input }) => {
    if (input.query.length < 2) {
      return [];
    }

    enforceRateLimit(`product-search:${ctx.userId}`, 20, 60_000);

    try {
      return await scrapSearch(input.query);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          error instanceof Error ? error.message : 'Failed to search products'
      });
    }
  });

export { searchRoute };
