import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ongoingListQueryKey } from './ongoing-list';

type TShoppingPresenceUser = {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastSeenAt: number;
};

type TShoppingActivity = {
  actor: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  product: {
    id: string;
    title: string;
  };
  status: 'checked' | 'ignored' | 'discarded';
  createdAt: number;
};

type TShoppingUpdateOptions = {
  onPresence?: (users: TShoppingPresenceUser[]) => void;
  onActivity?: (activity: TShoppingActivity) => void;
};

const shoppingListQueryKey = ['shopping-list'] as const;

const useShoppingList = (enabled: boolean) =>
  useQuery({
    queryKey: shoppingListQueryKey,
    queryFn: () => trpc.shopping.get.query(),
    enabled,
    refetchOnWindowFocus: true
  });

const useShoppingUpdates = (
  enabled: boolean,
  options: TShoppingUpdateOptions = {}
) => {
  const { onActivity, onPresence } = options;

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const subscription = trpc.shopping.onUpdate.subscribe(undefined, {
      onData: (event) => {
        if (event.type === 'presence-updated') {
          onPresence?.(event.users);
          return;
        }

        if (event.type === 'activity') {
          onActivity?.({
            actor: event.actor,
            product: event.product,
            status: event.status,
            createdAt: event.createdAt
          });
        }

        if (event.type === 'finished') {
          void queryClient.cancelQueries({ queryKey: shoppingListQueryKey });
          queryClient.setQueryData(shoppingListQueryKey, undefined);
          queryClient.removeQueries({ queryKey: shoppingListQueryKey });
        } else {
          void queryClient.invalidateQueries({
            queryKey: shoppingListQueryKey
          });
        }

        void queryClient.invalidateQueries({ queryKey: ongoingListQueryKey });
      },
      onError: () => undefined
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [enabled, onActivity, onPresence]);
};

const shoppingHistoryQueryKey = ['shopping-history'] as const;

const useShoppingHistory = (enabled: boolean) =>
  useQuery({
    queryKey: shoppingHistoryQueryKey,
    queryFn: () => trpc.shopping.history.query({ limit: 20 }),
    enabled
  });

export {
  shoppingHistoryQueryKey,
  shoppingListQueryKey,
  useShoppingHistory,
  useShoppingList,
  useShoppingUpdates
};
export type { TShoppingActivity, TShoppingPresenceUser };
