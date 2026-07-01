import z from 'zod';
import { updateUserSettings } from '../../db/mutations/users';
import { protectedProcedure } from '../../trpc';

const updateSettingsRoute = protectedProcedure
  .input(
    z.object({
      defaultShoppingMode: z.enum(['list', 'swipe']).optional(),
      compactShoppingList: z.boolean().optional(),
      hapticsEnabled: z.boolean().optional(),
      soundEnabled: z.boolean().optional(),
      wakeLockEnabled: z.boolean().optional()
    })
  )
  .mutation(async ({ ctx, input }) => {
    return updateUserSettings(ctx.userId, input);
  });

export { updateSettingsRoute };
