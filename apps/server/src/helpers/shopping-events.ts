import { sqlClient } from '@myapp/db';
import { EventEmitter } from 'node:events';

const SHOPPING_UPDATES_CHANNEL = 'shopping_updates';

type TShoppingUpdateEvent = {
  householdId: string;
  ongoingListId: string;
  type: 'started' | 'item-updated' | 'finished';
};

const shoppingEvents = new EventEmitter();

let listening = false;

const startShoppingEventsListener = async () => {
  if (listening) {
    return;
  }

  listening = true;

  await sqlClient.listen(SHOPPING_UPDATES_CHANNEL, (payload) => {
    if (!payload) {
      return;
    }

    try {
      const event = JSON.parse(payload) as TShoppingUpdateEvent;

      shoppingEvents.emit(event.householdId, event);
    } catch {
      // Ignore malformed notifications from outside this app.
    }
  });
};

const notifyShoppingUpdate = async (event: TShoppingUpdateEvent) => {
  await sqlClient`select pg_notify(${SHOPPING_UPDATES_CHANNEL}, ${JSON.stringify(event)})`;
};

export {
  notifyShoppingUpdate,
  shoppingEvents,
  startShoppingEventsListener
};
export type { TShoppingUpdateEvent };
