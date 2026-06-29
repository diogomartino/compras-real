import { TRPCError } from '@trpc/server';
import z from 'zod';
import { updateUserPassword } from '../../db/mutations/users';
import { getUserByEmailWithPassword } from '../../db/queries/users';
import { protectedProcedure } from '../../trpc';

const changePasswordRoute = protectedProcedure
  .input(
    z.object({
      currentPassword: z.string(),
      password: z.string(),
      confirmPassword: z.string()
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

    const user = await getUserByEmailWithPassword(ctx.user.email);

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    const passwordMatches = await Bun.password.verify(
      input.currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      ctx.throwValidationError(
        'currentPassword',
        'Current password is invalid'
      );
    }

    await updateUserPassword(
      ctx.userId,
      await Bun.password.hash(input.password)
    );

    return {
      success: true
    };
  });

export { changePasswordRoute };
