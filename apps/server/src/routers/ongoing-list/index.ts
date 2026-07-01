import { t } from '../../trpc';
import { addItemsRoute } from './add-items';
import { getRoute } from './get';
import { removeItemRoute } from './remove-item';
import { updateItemRoute } from './update-item';

const ongoingListRouter = t.router({
  get: getRoute,
  addItems: addItemsRoute,
  updateItem: updateItemRoute,
  removeItem: removeItemRoute
});

export { ongoingListRouter };
