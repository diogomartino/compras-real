import { and, categories, db, eq, sql } from '@myapp/db';

type TCategoryInput = {
  householdId: string;
  name: string;
};

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

const createCategory = async (input: TCategoryInput) => {
  const now = Date.now();
  const [category] = await db
    .insert(categories)
    .values({
      householdId: input.householdId,
      name: input.name.trim(),
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!category) {
    throw new Error('Failed to create category');
  }

  return category;
};

const updateCategory = async (categoryId: string, input: TCategoryInput) => {
  const [category] = await db
    .update(categories)
    .set({
      name: input.name.trim(),
      updatedAt: Date.now()
    })
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.householdId, input.householdId)
      )
    )
    .returning();

  if (!category) {
    throw new Error('Failed to update category');
  }

  return category;
};

const deleteCategory = async (householdId: string, categoryId: string) => {
  const [category] = await db
    .delete(categories)
    .where(
      and(
        eq(categories.id, categoryId),
        eq(categories.householdId, householdId)
      )
    )
    .returning();

  if (!category) {
    throw new Error('Failed to delete category');
  }

  return category;
};

const reorderCategories = async (
  householdId: string,
  orderedIds: string[]
) => {
  const now = Date.now();

  await db.transaction(async (tx) => {
    for (let index = 0; index < orderedIds.length; index += 1) {
      await tx
        .update(categories)
        .set({ position: index, updatedAt: now })
        .where(
          and(
            eq(categories.id, orderedIds[index]!),
            eq(categories.householdId, householdId)
          )
        );
    }
  });
};

export {
  createCategory,
  deleteCategory,
  getOrCreateCategoryId,
  reorderCategories,
  updateCategory
};
