import {
  getHouseholdById,
  getHouseholdMembers,
  getResolvedHouseholdIdForUser,
  getUserHouseholds
} from '../../db/queries/households';

// Everything the household screen + profile switcher need, in one shape.
const buildHouseholdOverview = async (
  userId: string,
  preferredId?: string | null
) => {
  const activeId = await getResolvedHouseholdIdForUser(userId, preferredId);
  const households = await getUserHouseholds(userId);
  const householdsWithActive = households.map((household) => ({
    ...household,
    isActive: household.id === activeId
  }));

  if (!activeId) {
    return { households: householdsWithActive, active: null };
  }

  const detail = await getHouseholdById(activeId);
  const members = await getHouseholdMembers(activeId);
  const myRole =
    members.find((member) => member.userId === userId)?.role ?? 'member';

  return {
    households: householdsWithActive,
    active: {
      id: activeId,
      name: detail?.name ?? '',
      myRole,
      members: members.map((member) => ({
        ...member,
        isSelf: member.userId === userId
      }))
    }
  };
};

export { buildHouseholdOverview };
