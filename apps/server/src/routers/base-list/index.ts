import { t } from '../../trpc';
import { addItemRoute } from './add-item';
import { createRoute } from './create';
import { getRoute } from './get';
import { listRoute } from './list';
import { removeItemRoute } from './remove-item';
import { removeListRoute } from './remove-list';
import { updateItemRoute } from './update-item';
import { updateListRoute } from './update-list';

const baseListRouter = t.router({
  list: listRoute,
  get: getRoute,
  create: createRoute,
  update: updateListRoute,
  remove: removeListRoute,
  addItem: addItemRoute,
  updateItem: updateItemRoute,
  removeItem: removeItemRoute
});

export { baseListRouter };
