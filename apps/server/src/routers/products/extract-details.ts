import { TRPCError } from '@trpc/server';
import z from 'zod';
import { scrapUrl } from '../../scrappers';
import { protectedProcedure } from '../../trpc';

const extractDetailsRoute = protectedProcedure
  .input(
    z
      .object({
        url: z.url()
      })
      .transform((data) => ({
        url: data.url.trim()
      }))
  )
  .mutation(async ({ input }) => {
    try {
      return await scrapUrl(input.url);
    } catch (error) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to extract product details'
      });
    }
  });

export { extractDetailsRoute };
