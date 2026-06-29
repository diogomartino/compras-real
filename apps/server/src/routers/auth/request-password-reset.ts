import z from 'zod';
import { getUserByEmail } from '../../db/queries/users';
import { createPasswordResetToken } from '../../helpers/auth-tokens';
import { sendPasswordResetEmail } from '../../helpers/password-reset-email';
import { requireEnv } from '../../helpers/require-env';
import { publicProcedure } from '../../trpc';

const requestPasswordResetRoute = publicProcedure
  .input(
    z
      .object({
        email: z.email()
      })
      .transform((data) => ({
        email: data.email.trim().toLowerCase()
      }))
  )
  .mutation(async ({ input }) => {
    const user = await getUserByEmail(input.email);

    if (user) {
      const token = createPasswordResetToken(user.id);
      const resetUrl = new URL('/reset-password', requireEnv('CLIENT_URL'));

      resetUrl.searchParams.set('token', token);

      await sendPasswordResetEmail(user.email, resetUrl.toString());
    }

    return {
      success: true
    };
  });

export { requestPasswordResetRoute };
