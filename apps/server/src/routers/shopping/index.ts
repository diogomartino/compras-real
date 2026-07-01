import { t } from '../../trpc';
import { cancelRoute } from './cancel';
import { finishRoute } from './finish';
import { getRoute } from './get';
import { historyRoute } from './history';
import { onUpdateRoute } from './on-update';
import { setItemStatusRoute } from './set-item-status';
import { startRoute } from './start';

const shoppingRouter = t.router({
  get: getRoute,
  history: historyRoute,
  start: startRoute,
  cancel: cancelRoute,
  setItemStatus: setItemStatusRoute,
  finish: finishRoute,
  onUpdate: onUpdateRoute
});

export { shoppingRouter };
