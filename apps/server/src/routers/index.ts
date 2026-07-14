import { t } from '../trpc';
import { authRouter } from './auth';
import { baseListRouter } from './base-list';
import { categoriesRouter } from './categories';
import { householdRouter } from './household';
import { ongoingListRouter } from './ongoing-list';
import { productsRouter } from './products';
import { shoppingRouter } from './shopping';
import { utilsRouter } from './utils';

const appRouter = t.router({
  utils: utilsRouter,
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
  baseList: baseListRouter,
  ongoingList: ongoingListRouter,
  shopping: shoppingRouter,
  household: householdRouter
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
