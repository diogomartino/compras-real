import { sqlClient } from '@myapp/db';
import type { TOngoingListItemStatus, TUser } from '@myapp/shared';
import { EventEmitter } from 'node:events';

const SHOPPING_UPDATES_CHANNEL = 'shopping_updates';

type TShoppingUserSummary = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

type TShoppingPresenceUser = TShoppingUserSummary & {
  lastSeenAt: number;
};

type TShoppingBaseEvent = {
  householdId: string;
  ongoingListId: string;
};

type TShoppingUpdateEvent =
  | (TShoppingBaseEvent & {
      type: 'started' | 'item-updated' | 'finished';
    })
  | (TShoppingBaseEvent & {
      type: 'activity';
      actor: TShoppingUserSummary;
      product: {
        id: string;
        title: string;
      };
      status: Exclude<TOngoingListItemStatus, 'pending'>;
      createdAt: number;
    })
  | (TShoppingBaseEvent & {
      type: 'presence-updated';
      users: TShoppingPresenceUser[];
    });

const shoppingEvents = new EventEmitter();
const shoppingPresence = new Map<
  string,
  Map<
    string,
    {
      user: TShoppingPresenceUser;
      connectionCount: number;
    }
  >
>();

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

const getShoppingPresenceEvent = (
  householdId: string,
  ongoingListId: string
): TShoppingUpdateEvent => ({
  householdId,
  ongoingListId,
  type: 'presence-updated',
  users: Array.from(shoppingPresence.get(householdId)?.values() ?? [])
    .map((entry) => entry.user)
    .sort((firstUser, secondUser) => firstUser.name.localeCompare(secondUser.name))
});

const emitShoppingPresence = (householdId: string, ongoingListId: string) => {
  shoppingEvents.emit(
    householdId,
    getShoppingPresenceEvent(householdId, ongoingListId)
  );
};

const enterShoppingPresence = (
  householdId: string,
  ongoingListId: string,
  user: TUser
) => {
  const householdPresence =
    shoppingPresence.get(householdId) ?? new Map<string, {
      user: TShoppingPresenceUser;
      connectionCount: number;
    }>();
  const currentPresence = householdPresence.get(user.id);
  const now = Date.now();

  householdPresence.set(user.id, {
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      lastSeenAt: now
    },
    connectionCount: (currentPresence?.connectionCount ?? 0) + 1
  });
  shoppingPresence.set(householdId, householdPresence);
  emitShoppingPresence(householdId, ongoingListId);
};

const leaveShoppingPresence = (
  householdId: string,
  ongoingListId: string,
  userId: string
) => {
  const householdPresence = shoppingPresence.get(householdId);
  const currentPresence = householdPresence?.get(userId);

  if (!householdPresence || !currentPresence) {
    return;
  }

  if (currentPresence.connectionCount > 1) {
    householdPresence.set(userId, {
      ...currentPresence,
      connectionCount: currentPresence.connectionCount - 1
    });
  } else {
    householdPresence.delete(userId);
  }

  if (householdPresence.size === 0) {
    shoppingPresence.delete(householdId);
  }

  emitShoppingPresence(householdId, ongoingListId);
};

export {
  enterShoppingPresence,
  getShoppingPresenceEvent,
  leaveShoppingPresence,
  notifyShoppingUpdate,
  shoppingEvents,
  startShoppingEventsListener
};
export type { TShoppingPresenceUser, TShoppingUpdateEvent, TShoppingUserSummary };
