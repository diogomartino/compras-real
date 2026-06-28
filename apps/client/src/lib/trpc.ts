import { getLocalStorageItem, LocalStorageKey } from '@/helpers/storage';
import { type AppRouter } from '@myapp/shared';
import { createTRPCClient, createWSClient, wsLink } from '@trpc/client';
import superjson from 'superjson';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const getWebSocketUrl = () => {
  const url = new URL(API_URL);

  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/trpc';
  url.search = '';
  url.hash = '';

  return url.toString();
};

const createWebSocketClient = () =>
  createWSClient({
    url: getWebSocketUrl(),
    connectionParams: () => {
      const token = getLocalStorageItem(LocalStorageKey.TOKEN);

      return token ? { authorization: `Bearer ${token}` } : {};
    },
    keepAlive: {
      enabled: true,
      intervalMs: 30_000,
      pongTimeoutMs: 5_000
    }
  });

let wsClient: ReturnType<typeof createWSClient> = createWebSocketClient();

const createClient = () =>
  createTRPCClient<AppRouter>({
    links: [
      wsLink({
        client: wsClient,
        transformer: superjson
      })
    ]
  });

let trpc = createClient();

const resetTRPCClient = async () => {
  await wsClient.close().catch(() => undefined);

  wsClient = createWebSocketClient();
  trpc = createClient();
};

export { resetTRPCClient, trpc };
