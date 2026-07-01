import { createOngoingList } from '../../db/mutations/ongoing-list';
import { getOpenOngoingList } from '../../db/queries/ongoing-list';

const getOrCreateActiveOngoingList = async (
  householdId: string,
  userId: string
) => {
  const existingList = await getOpenOngoingList(householdId);

  if (existingList) {
    return existingList;
  }

  return createOngoingList(householdId, userId);
};

export { getOrCreateActiveOngoingList };
