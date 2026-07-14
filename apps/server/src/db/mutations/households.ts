import { and, db, eq, householdMembers, users } from '@myapp/db';

const setActiveHousehold = async (userId: string, householdId: string) => {
  await db
    .update(users)
    .set({ activeHouseholdId: householdId, updatedAt: Date.now() })
    .where(eq(users.id, userId));
};

const addHouseholdMember = async (householdId: string, userId: string) => {
  const now = Date.now();

  await db.insert(householdMembers).values({
    householdId,
    userId,
    role: 'member',
    createdAt: now,
    updatedAt: now
  });
};

const removeHouseholdMember = async (householdId: string, userId: string) => {
  await db
    .delete(householdMembers)
    .where(
      and(
        eq(householdMembers.householdId, householdId),
        eq(householdMembers.userId, userId)
      )
    );
};

export { addHouseholdMember, removeHouseholdMember, setActiveHousehold };
