import { t } from '../../trpc';
import { addFromBaseListRoute } from './add-from-base-list';
import { addItemsRoute } from './add-items';
import { getRoute } from './get';
import { removeItemRoute } from './remove-item';
import { updateItemRoute } from './update-item';

const ongoingListRouter = t.router({
  get: getRoute,
  addItems: addItemsRoute,
  addFromBaseList: addFromBaseListRoute,
  updateItem: updateItemRoute,
  removeItem: removeItemRoute
});

export { ongoingListRouter };
