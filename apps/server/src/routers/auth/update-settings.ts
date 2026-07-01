import z from 'zod';
import { updateUserSettings } from '../../db/mutations/users';
import { protectedProcedure } from '../../trpc';

const updateSettingsRoute = protectedProcedure
  .input(
    z.object({
      defaultShoppingMode: z.enum(['list', 'swipe'])
    })
  )
  .mutation(async ({ ctx, input }) => {
    return updateUserSettings(ctx.userId, input);
  });

export { updateSettingsRoute };
