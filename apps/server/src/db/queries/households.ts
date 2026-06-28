import { db, eq, householdMembers } from '@myapp/db';

const getFirstHouseholdIdForUser = async (userId: string) => {
  const [membership] = await db
    .select({ householdId: householdMembers.householdId })
    .from(householdMembers)
    .where(eq(householdMembers.userId, userId))
    .limit(1);

  return membership?.householdId;
};

export { getFirstHouseholdIdForUser };
