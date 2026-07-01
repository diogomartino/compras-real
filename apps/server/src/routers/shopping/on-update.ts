import { observable } from '@trpc/server/observable';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import {
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

  return observable<TShoppingUpdateEvent>((emit) => {
    const listener = (event: TShoppingUpdateEvent) => {
      emit.next(event);
    };

    shoppingEvents.on(householdId, listener);

    return () => {
      shoppingEvents.off(householdId, listener);
    };
  });
});

export { onUpdateRoute };
