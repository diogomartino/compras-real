import { TRPCError } from '@trpc/server';
import { cancelShoppingList } from '../../db/mutations/shopping';
import { getShoppingOngoingList } from '../../db/queries/shopping';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { notifyShoppingUpdate } from '../../helpers/shopping-events';
import { protectedProcedure } from '../../trpc';

const cancelRoute = protectedProcedure.mutation(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(
    ctx,
    'cancelling shopping mode'
  );
  const shoppingList = await getShoppingOngoingList(householdId);

  if (!shoppingList) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Shopping list not found'
    });
  }

  const activeList = await cancelShoppingList(shoppingList.id);

  await notifyShoppingUpdate({
    householdId,
    ongoingListId: shoppingList.id,
    type: 'finished'
  });

  return activeList;
});

export { cancelRoute };
