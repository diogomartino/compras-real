import {
  and,
  db,
  eq,
  householdMembers,
  households,
  sql,
  users
} from '@myapp/db';

const getResolvedHouseholdIdForUser = async (
  userId: string,
  preferredId?: string | null
) => {
  const memberships = await db
    .select({ householdId: householdMembers.householdId })
    .from(householdMembers)
    .where(eq(householdMembers.userId, userId))
    .orderBy(householdMembers.createdAt);

  if (
    preferredId &&
    memberships.some((membership) => membership.householdId === preferredId)
  ) {
    return preferredId;
  }

  return memberships[0]?.householdId;
};

type THouseholdSummary = {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  memberCount: number;
};

const getUserHouseholds = async (
  userId: string
): Promise<THouseholdSummary[]> => {
  return db
    .select({
      id: households.id,
      name: households.name,
      role: householdMembers.role,
      memberCount: sql<number>`(select count(*)::int from ${householdMembers} as members where members.household_id = ${households.id})`
    })
    .from(householdMembers)
    .innerJoin(households, eq(householdMembers.householdId, households.id))
    .where(eq(householdMembers.userId, userId))
    .orderBy(householdMembers.createdAt);
};

const getHouseholdById = async (householdId: string) => {
  const [household] = await db
    .select({ id: households.id, name: households.name })
    .from(households)
    .where(eq(households.id, householdId))
    .limit(1);

  return household;
};

type THouseholdMemberInfo = {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'member';
};

const getHouseholdMembers = async (
  householdId: string
): Promise<THouseholdMemberInfo[]> => {
  return db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      role: householdMembers.role
    })
    .from(householdMembers)
    .innerJoin(users, eq(householdMembers.userId, users.id))
    .where(eq(householdMembers.householdId, householdId))
    .orderBy(householdMembers.createdAt);
};

const getMembership = async (userId: string, householdId: string) => {
  const [membership] = await db
    .select({ role: householdMembers.role })
    .from(householdMembers)
    .where(
      and(
        eq(householdMembers.userId, userId),
        eq(householdMembers.householdId, householdId)
      )
    )
    .limit(1);

  return membership;
};

export {
  getHouseholdById,
  getHouseholdMembers,
  getMembership,
  getResolvedHouseholdIdForUser,
  getUserHouseholds
};
export type { THouseholdMemberInfo, THouseholdSummary };
