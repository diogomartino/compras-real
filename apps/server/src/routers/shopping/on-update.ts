import { observable } from '@trpc/server/observable';
import { getShoppingOngoingList } from '../../db/queries/shopping';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import {
  enterShoppingPresence,
  getShoppingPresenceEvent,
  leaveShoppingPresence,
  shoppingEvents,
  startShoppingEventsListener,
  type TShoppingUpdateEvent
} from '../../helpers/shopping-events';
import { protectedProcedure } from '../../trpc';

const onUpdateRoute = protectedProcedure.subscription(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(
    ctx,
    'subscribing to shopping updates'
  );

  await startShoppingEventsListener();
  const shoppingList = await getShoppingOngoingList(householdId);

  return observable<TShoppingUpdateEvent>((emit) => {
    const listener = (event: TShoppingUpdateEvent) => {
      emit.next(event);
    };

    shoppingEvents.on(householdId, listener);

    if (shoppingList) {
      enterShoppingPresence(householdId, shoppingList.id, ctx.user);
      emit.next(getShoppingPresenceEvent(householdId, shoppingList.id));
    }

    return () => {
      shoppingEvents.off(householdId, listener);

      if (shoppingList) {
        leaveShoppingPresence(householdId, shoppingList.id, ctx.userId);
      }
    };
  });
});

export { onUpdateRoute };
