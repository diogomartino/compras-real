import { and, categories, db, eq, sql } from '@myapp/db';

const getOrCreateCategoryId = async (
  householdId: string,
  categoryName: string | null,
  now: number
) => {
  const normalizedCategoryName = categoryName?.trim();

  if (!normalizedCategoryName) {
    return null;
  }

  const [matchingCategory] = await db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .where(
      and(
        eq(categories.householdId, householdId),
        sql`lower(${categories.name}) = lower(${normalizedCategoryName})`
      )
    )
    .limit(1);

  if (matchingCategory) {
    return matchingCategory.id;
  }

  const [category] = await db
    .insert(categories)
    .values({
      householdId,
      name: normalizedCategoryName,
      createdAt: now,
      updatedAt: now
    })
    .returning({ id: categories.id });

  if (!category) {
    throw new Error('Failed to create category');
  }

  return category.id;
};

export { getOrCreateCategoryId };
