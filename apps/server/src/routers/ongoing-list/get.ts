import { getOngoingListDetails } from '../../db/queries/ongoing-list';
import { getRequiredHouseholdId } from '../../helpers/get-required-household-id';
import { protectedProcedure } from '../../trpc';
import { getOrCreateActiveOngoingList } from './helpers';

const getRoute = protectedProcedure.query(async ({ ctx }) => {
  const householdId = await getRequiredHouseholdId(
    ctx,
    'viewing the ongoing list'
  );
  const ongoingList = await getOrCreateActiveOngoingList(
    householdId,
    ctx.userId
  );

  return getOngoingListDetails(householdId, ongoingList.id);
});

export { getRoute };
