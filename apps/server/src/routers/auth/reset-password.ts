import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateUserPassword } from '../../db/mutations/users';
import { getUserById } from '../../db/queries/users';
import { verifyPasswordResetToken } from '../../helpers/auth-tokens';
import { publicProcedure } from '../../trpc';

const resetPasswordRoute = publicProcedure
  .input(
    z.object({
      token: z.string().max(4096),
      password: z.string().max(200),
      confirmPassword: z.string().max(200)
    })
  )
  .mutation(async ({ ctx, input }) => {
    if (input.password.length < 8) {
      ctx.throwValidationError(
        'password',
        'Password must be at least 8 characters'
      );
    }

    if (input.password !== input.confirmPassword) {
      ctx.throwValidationError('confirmPassword', 'Passwords do not match');
    }

    const resetToken = verifyPasswordResetToken(input.token);

    if (!resetToken) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Password reset link is invalid or expired'
      });
    }

    const user = await getUserById(resetToken.userId);

    if (!user || resetToken.issuedAt < Math.floor(user.updatedAt / 1000)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Password reset link is invalid or expired'
      });
    }

    await updateUserPassword(user.id, await Bun.password.hash(input.password));

    return {
      success: true
    };
  });

export { resetPasswordRoute };
