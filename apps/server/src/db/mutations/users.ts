import { db, users } from '@myapp/db';
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

export { createUser };
