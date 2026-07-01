import { queryClient } from '@/lib/query-client';
import { trpc } from '@/lib/trpc';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ongoingListQueryKey } from './ongoing-list';

const shoppingListQueryKey = ['shopping-list'] as const;

const useShoppingList = (enabled: boolean) =>
  useQuery({
    queryKey: shoppingListQueryKey,
    queryFn: () => trpc.shopping.get.query(),
    enabled,
    refetchOnWindowFocus: true
  });

const useShoppingUpdates = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const subscription = trpc.shopping.onUpdate.subscribe(undefined, {
      onData: (event) => {
        if (event.type === 'finished') {
          void queryClient.cancelQueries({ queryKey: shoppingListQueryKey });
          queryClient.setQueryData(shoppingListQueryKey, undefined);
          queryClient.removeQueries({ queryKey: shoppingListQueryKey });
        } else {
          void queryClient.invalidateQueries({ queryKey: shoppingListQueryKey });
        }

        void queryClient.invalidateQueries({ queryKey: ongoingListQueryKey });
      },
      onError: () => undefined
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [enabled]);
};

export { shoppingListQueryKey, useShoppingList, useShoppingUpdates };
