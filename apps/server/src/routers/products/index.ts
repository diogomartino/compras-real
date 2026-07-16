import { t } from '../../trpc';
import { addRoute } from './add';
import { deleteRoute } from './delete';
import { extractDetailsRoute } from './extract-details';
import { listRoute } from './list';
import { recentRoute } from './recent';
import { searchRoute } from './search';
import { suggestionsRoute } from './suggestions';
import { updateRoute } from './update';

export const productsRouter = t.router({
  list: listRoute,
  recent: recentRoute,
  suggestions: suggestionsRoute,
  search: searchRoute,
  add: addRoute,
  update: updateRoute,
  delete: deleteRoute,
  extractDetails: extractDetailsRoute
});
