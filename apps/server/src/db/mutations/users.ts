import {
  db,
  eq,
  householdMembers,
  households,
  ongoingLists,
  users
} from '@myapp/db';
import type { TIUser, TUser } from '@myapp/shared';

type TUserSettingsInput = {
  defaultShoppingMode?: 'list' | 'swipe';
  compactShoppingList?: boolean;
  hapticsEnabled?: boolean;
  soundEnabled?: boolean;
  wakeLockEnabled?: boolean;
  swipeOnboardingSeen?: boolean;
};

const createUser = async (data: TIUser): Promise<TUser> => {
  const [user] = await db.insert(users).values(data).returning({
    id: users.id,
    name: users.name,
    email: users.email,
    avatarUrl: users.avatarUrl,
    isAdmin: users.isAdmin,
    activeHouseholdId: users.activeHouseholdId,
    settings: users.settings,
    passwordChangedAt: users.passwordChangedAt,
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
      activeHouseholdId: users.activeHouseholdId,
      settings: users.settings,
      passwordChangedAt: users.passwordChangedAt,
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

    await tx.insert(ongoingLists).values({
      householdId: household.id,
      status: 'active',
      createdBy: createdUser.id,
      createdAt: now,
      updatedAt: now
    });

    await tx
      .update(users)
      .set({ activeHouseholdId: household.id })
      .where(eq(users.id, createdUser.id));

    return { ...createdUser, activeHouseholdId: household.id };
  });

  return user;
};

const updateUserPassword = async (userId: string, passwordHash: string) => {
  const now = Date.now();
  const [user] = await db
    .update(users)
    .set({
      passwordHash,
      passwordChangedAt: now,
      updatedAt: now
    })
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  if (!user) {
    throw new Error('Failed to update user password');
  }

  return user;
};

const updateUserSettings = async (
  userId: string,
  settings: TUserSettingsInput
) => {
  const [currentUser] = await db
    .select({ settings: users.settings })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!currentUser) {
    throw new Error('Failed to update user settings');
  }

  const [user] = await db
    .update(users)
    .set({
      settings: {
        ...currentUser.settings,
        ...settings
      },
      updatedAt: Date.now()
    })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      avatarUrl: users.avatarUrl,
      isAdmin: users.isAdmin,
      activeHouseholdId: users.activeHouseholdId,
      settings: users.settings,
      passwordChangedAt: users.passwordChangedAt,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    });

  if (!user) {
    throw new Error('Failed to update user settings');
  }

  return user;
};

export {
  createUser,
  createUserWithHousehold,
  updateUserPassword,
  updateUserSettings
};
