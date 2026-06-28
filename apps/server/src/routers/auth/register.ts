import z from 'zod';
import { createUser } from '../../db/mutations/users';
import { getUserByEmail } from '../../db/queries/users';
import { createAccessToken } from '../../helpers/auth-tokens';
import { publicProcedure } from '../../trpc';

const registerRoute = publicProcedure
  .input(
    z
      .object({
        name: z.string(),
        email: z.email(),
        password: z.string(),
        confirmPassword: z.string()
      })
      .transform((data) => ({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        confirmPassword: data.confirmPassword
      }))
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

    const existingUser = await getUserByEmail(input.email);

    if (existingUser) {
      ctx.throwValidationError(
        'email',
        'An account already exists for this email'
      );
    }

    const now = Date.now();

    const user = await createUser({
      name: input.name,
      email: input.email,
      passwordHash: await Bun.password.hash(input.password),
      createdAt: now,
      updatedAt: now
    });

    return {
      token: createAccessToken(user.id),
      user
    };
  });

export { registerRoute };
