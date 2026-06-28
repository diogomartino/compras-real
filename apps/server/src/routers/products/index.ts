import { t } from '../../trpc';
import { addRoute } from './add';
import { archiveRoute } from './archive';
import { extractDetailsRoute } from './extract-details';
import { listRoute } from './list';
import { restoreRoute } from './restore';
import { updateRoute } from './update';

export const productsRouter = t.router({
  list: listRoute,
  add: addRoute,
  update: updateRoute,
  archive: archiveRoute,
  restore: restoreRoute,
  extractDetails: extractDetailsRoute
});
