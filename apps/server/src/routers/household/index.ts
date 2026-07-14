import { t } from '../../trpc';
import { inviteRoute } from './invite';
import { leaveRoute } from './leave';
import { overviewRoute } from './overview';
import { removeMemberRoute } from './remove-member';
import { switchRoute } from './switch';

const householdRouter = t.router({
  overview: overviewRoute,
  switch: switchRoute,
  invite: inviteRoute,
  removeMember: removeMemberRoute,
  leave: leaveRoute
});

export { householdRouter };
