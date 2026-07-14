import { db, eq, users } from '@myapp/db';
import type { TUser } from '@myapp/shared';

const publicUserColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  avatarUrl: users.avatarUrl,
  isAdmin: users.isAdmin,
  activeHouseholdId: users.activeHouseholdId,
  settings: users.settings,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt
};

const getUserById = async (userId: string): Promise<TUser | undefined> => {
  const [user] = await db
    .select(publicUserColumns)
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user;
};

const getUserByEmail = async (email: string): Promise<TUser | undefined> => {
  const [user] = await db
    .select(publicUserColumns)
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
};

const getUserByEmailWithPassword = async (email: string) => {
  const [user] = await db
    .select({
      ...publicUserColumns,
      passwordHash: users.passwordHash
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
};

export { getUserByEmail, getUserByEmailWithPassword, getUserById };
