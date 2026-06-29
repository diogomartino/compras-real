import { t } from '../trpc';
import { authRouter } from './auth';
import { baseListRouter } from './base-list';
import { productsRouter } from './products';
import { utilsRouter } from './utils';

const appRouter = t.router({
  utils: utilsRouter,
  auth: authRouter,
  products: productsRouter,
  baseList: baseListRouter
});

type AppRouter = typeof appRouter;

export { appRouter };
export type { AppRouter };
