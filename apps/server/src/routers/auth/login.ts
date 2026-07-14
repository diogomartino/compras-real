import { TRPCError } from '@trpc/server';
import z from 'zod';
import { getUserByEmailWithPassword } from '../../db/queries/users';
import { createAccessToken } from '../../helpers/auth-tokens';
import { enforceRateLimit } from '../../helpers/rate-limit';
import { publicProcedure } from '../../trpc';

let dummyHashPromise: Promise<string> | undefined;

const getDummyHash = () => {
  if (!dummyHashPromise) {
    dummyHashPromise = Bun.password.hash('login-timing-equalizer');
  }

  return dummyHashPromise;
};

const invalidCredentials = () =>
  new TRPCError({
    code: 'UNAUTHORIZED',
    message: JSON.stringify([
      {
        code: 'custom',
        path: ['email'],
        message: 'Invalid email or password'
      }
    ])
  });

const loginRoute = publicProcedure
  .input(
    z
      .object({
        email: z.email(),
        password: z.string().max(200)
      })
      .transform((data) => ({
        email: data.email.trim().toLowerCase(),
        password: data.password
      }))
  )
  .mutation(async ({ input }) => {
    enforceRateLimit(`login:${input.email}`, 10, 5 * 60_000);

    const user = await getUserByEmailWithPassword(input.email);
    const passwordHash = user?.passwordHash ?? (await getDummyHash());
    const passwordMatches = await Bun.password.verify(
      input.password,
      passwordHash
    );

    if (!user || !passwordMatches) {
      throw invalidCredentials();
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
      activeHouseholdId: user.activeHouseholdId,
      settings: user.settings,
      passwordChangedAt: user.passwordChangedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return {
      token: createAccessToken(user.id),
      user: publicUser
    };
  });

export { loginRoute };
