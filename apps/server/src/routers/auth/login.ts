import { TRPCError } from '@trpc/server';
import z from 'zod';
import { getUserByEmailWithPassword } from '../../db/queries/users';
import { createAccessToken } from '../../helpers/auth-tokens';
import { publicProcedure } from '../../trpc';

const loginRoute = publicProcedure
  .input(
    z
      .object({
        email: z.email(),
        password: z.string()
      })
      .transform((data) => ({
        email: data.email.trim().toLowerCase(),
        password: data.password
      }))
  )
  .mutation(async ({ input }) => {
    const user = await getUserByEmailWithPassword(input.email);

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: JSON.stringify([
          {
            code: 'custom',
            path: ['email'],
            message: 'Invalid email or password'
          }
        ])
      });
    }

    const passwordMatches = await Bun.password.verify(
      input.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: JSON.stringify([
          {
            code: 'custom',
            path: ['email'],
            message: 'Invalid email or password'
          }
        ])
      });
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
      settings: user.settings,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return {
      token: createAccessToken(user.id),
      user: publicUser
    };
  });

export { loginRoute };
