import { TRPCError } from '@trpc/server';
import z from 'zod';
import { addHouseholdMember } from '../../db/mutations/households';
import {
  getMembership,
  getResolvedHouseholdIdForUser
} from '../../db/queries/households';
import { getUserByEmail } from '../../db/queries/users';
import { protectedProcedure } from '../../trpc';
import { buildHouseholdOverview } from './build-overview';

const inviteRoute = protectedProcedure
  .input(z.object({ email: z.string().trim().min(1).max(200) }))
  .mutation(async ({ ctx, input }) => {
    const householdId = await getResolvedHouseholdIdForUser(
      ctx.userId,
      ctx.user.activeHouseholdId
    );

    if (!householdId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You must belong to a household before inviting'
      });
    }

    const membership = await getMembership(ctx.userId, householdId);

    if (membership?.role !== 'owner') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Only the household owner can invite members'
      });
    }

    const invitee = await getUserByEmail(input.email.trim().toLowerCase());

    if (!invitee) {
      ctx.throwValidationError('email', 'No account with that email');
      return;
    }

    if (invitee.id === ctx.userId) {
      ctx.throwValidationError('email', 'You are already in this household');
      return;
    }

    const existing = await getMembership(invitee.id, householdId);

    if (existing) {
      ctx.throwValidationError('email', 'This person is already a member');
      return;
    }

    await addHouseholdMember(householdId, invitee.id);

    return buildHouseholdOverview(ctx.userId, householdId);
  });

export { inviteRoute };
