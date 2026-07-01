import { t } from '../trpc';
import { authRouter } from './auth';
import { baseListRouter } from './base-list';
import { ongoingListRouter } from './ongoing-list';
import { productsRouter } from './products';
import { shoppingRouter } from './shopping';
import { utilsRouter } from './utils';

const appRouter = t.router({
  utils: utilsRouter,
  auth: authRouter,
  products: productsRouter,
  baseList: baseListRouter,
  ongoingList: ongoingListRouter,
  shopping: shoppingRouter
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
