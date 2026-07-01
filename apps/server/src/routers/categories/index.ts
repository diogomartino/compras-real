import { t } from '../../trpc';
import { createRoute } from './create';
import { deleteRoute } from './delete';
import { listRoute } from './list';
import { updateRoute } from './update';

const categoriesRouter = t.router({
  list: listRoute,
  create: createRoute,
  update: updateRoute,
  delete: deleteRoute
});

export { categoriesRouter };
