import {
  and,
  categories,
  db,
  eq,
  productUsageStats,
  products,
  sql
} from '@myapp/db';
import type { TCatalogProduct } from '@myapp/shared';

const getCatalogProducts = async (
  householdId: string
): Promise<TCatalogProduct[]> => {
  return db
    .select({
      id: products.id,
      title: products.title,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.name,
      defaultQuantityAmount: products.defaultQuantityAmount,
      defaultQuantityUnit: products.defaultQuantityUnit,
      sourceUrl: products.sourceUrl,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.householdId, householdId));
};

const getRecentCatalogProducts = async (
  householdId: string,
  limit: number
): Promise<TCatalogProduct[]> => {
  return db
    .select({
      id: products.id,
      title: products.title,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      categoryName: categories.name,
      defaultQuantityAmount: products.defaultQuantityAmount,
      defaultQuantityUnit: products.defaultQuantityUnit,
      sourceUrl: products.sourceUrl,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt
    })
    .from(productUsageStats)
    .innerJoin(products, eq(productUsageStats.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(productUsageStats.householdId, householdId))
    .orderBy(sql`${productUsageStats.lastUsedAt} desc nulls last`)
    .limit(limit);
};

const getProductById = async (productId: string) => {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  return product;
};

const getProductByTitle = async (householdId: string, title: string) => {
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(
      and(
        eq(products.householdId, householdId),
        sql`lower(${products.title}) = lower(${title})`
      )
    )
    .limit(1);

  return product;
};

export {
  getCatalogProducts,
  getProductById,
  getProductByTitle,
  getRecentCatalogProducts
};
