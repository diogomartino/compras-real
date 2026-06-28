import { db, householdMembers, households, users } from '@myapp/db';
import type { TIUser, TUser } from '@myapp/shared';

const createUser = async (data: TIUser): Promise<TUser> => {
  const [user] = await db.insert(users).values(data).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    avatarUrl: users.avatarUrl,
    isAdmin: users.isAdmin,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt
  });

  if (!user) {
    throw new Error('Failed to create user');
  }

  return user;
};

const createUserWithHousehold = async (
  data: TIUser,
  householdName: string,
  now: number
): Promise<TUser> => {
  const user = await db.transaction(async (tx) => {
    const [createdUser] = await tx.insert(users).values(data).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      isAdmin: users.isAdmin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    });

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    const [household] = await tx
      .insert(households)
      .values({
        name: householdName,
        createdBy: createdUser.id,
        createdAt: now,
        updatedAt: now
      })
      .returning({ id: households.id });

    if (!household) {
      throw new Error('Failed to create household');
    }

    await tx.insert(householdMembers).values({
      householdId: household.id,
      userId: createdUser.id,
      role: 'owner',
      createdAt: now,
      updatedAt: now
    });

    return createdUser;
  });

  return user;
};

export { createUser, createUserWithHousehold };
