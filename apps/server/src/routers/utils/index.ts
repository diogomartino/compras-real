import { t } from '../../trpc';
import { getPriceRoute } from './get-price';

export const utilsRouter = t.router({
  getPrice: getPriceRoute
});
