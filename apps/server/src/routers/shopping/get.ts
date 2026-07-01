import {
  getShoppingListDetails,
  getShoppingOngoingList
} from '../../db/queries/shopping';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';

const getRoute = protectedProcedure.query(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(
    ctx,
    'viewing shopping mode'
  );
  const shoppingList = await getShoppingOngoingList(householdId);

  if (!shoppingList) {
    return undefined;
  }

  return getShoppingListDetails(householdId, shoppingList.id);
});

export { getRoute };
