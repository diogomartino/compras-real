import { TRPCError } from '@trpc/server';
import { startShoppingList } from '../../db/mutations/shopping';
import { getOngoingListDetails } from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { notifyShoppingUpdate } from '../../helpers/shopping-events';
import { protectedProcedure } from '../../trpc';
import { getOrCreateActiveOngoingList } from '../ongoing-list/helpers';

const startRoute = protectedProcedure.mutation(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(ctx, 'starting shopping mode');
  const activeList = await getOrCreateActiveOngoingList(householdId, ctx.userId);
  const details = await getOngoingListDetails(householdId, activeList.id);

  if (!details || details.items.length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Add products before starting shopping mode'
    });
  }

  const shoppingList = await startShoppingList(activeList.id, ctx.userId);

  await notifyShoppingUpdate({
    householdId,
    ongoingListId: shoppingList.id,
    type: 'started'
  });

  return shoppingList;
});

export { startRoute };
