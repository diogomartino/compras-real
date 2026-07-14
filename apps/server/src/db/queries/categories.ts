import { categories, db, eq, products, sql } from '@myapp/db';

type TCategorySummary = {
  id: string;
  name: string;
  position: number;
  productCount: number;
  createdAt: number;
  updatedAt: number;
};

const getCategories = async (
  householdId: string
): Promise<TCategorySummary[]> => {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      position: categories.position,
      productCount: sql<number>`count(${products.id})::int`,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .where(eq(categories.householdId, householdId))
    .groupBy(categories.id)
    .orderBy(categories.position, categories.name);
};

const getCategoryByName = async (householdId: string, name: string) => {
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(
      sql`${categories.householdId} = ${householdId} and lower(${categories.name}) = lower(${name})`
    )
    .limit(1);

  return category;
};

export { getCategories, getCategoryByName };
export type { TCategorySummary };
