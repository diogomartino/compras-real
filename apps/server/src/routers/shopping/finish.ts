import { TRPCError } from '@trpc/server';
import { finishShoppingList } from '../../db/mutations/shopping';
import {
  getEnabledBaseListItemsForSeed,
  getShoppingListDetails,
  getShoppingOngoingList
} from '../../db/queries/shopping';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { notifyShoppingUpdate } from '../../helpers/shopping-events';
import { protectedProcedure } from '../../trpc';

const finishRoute = protectedProcedure.mutation(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(
    ctx,
    'finishing shopping mode'
  );
  const shoppingList = await getShoppingOngoingList(householdId);

  if (!shoppingList) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Shopping list not found'
    });
  }

  const details = await getShoppingListDetails(householdId, shoppingList.id);
  const hasOpenItems = details?.items.some(
    (item) => item.status === 'pending' || item.status === 'ignored'
  );

  if (hasOpenItems) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Finish the remaining products before completing shopping'
    });
  }

  const seedItems = await getEnabledBaseListItemsForSeed(householdId);
  const result = await finishShoppingList(
    shoppingList.id,
    householdId,
    ctx.userId,
    seedItems
  );

  await notifyShoppingUpdate({
    householdId,
    ongoingListId: shoppingList.id,
    type: 'finished'
  });

  return result.newList;
});

export { finishRoute };
