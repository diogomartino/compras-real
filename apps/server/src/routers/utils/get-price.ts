import z from 'zod';
import { publicProcedure } from '../../trpc';

const getPriceRoute = publicProcedure
  .input(
    z.object({
      marketHashName: z.string()
    })
  )
  .query(async ({ input }) => {
    return `Price for ${input.marketHashName} is ${Math.floor(Math.random() * 100)} USD`;
  });

export { getPriceRoute };
