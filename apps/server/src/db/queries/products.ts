import {
  and,
  categories,
  db,
  eq,
  inArray,
  notInArray,
  ongoingListItems,
  ongoingLists,
  productUsageStats,
  products,
  sql
} from '@myapp/db';
import type { TCatalogProduct, TSuggestedProduct } from '@myapp/shared';

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

const getSuggestedProducts = async (
  householdId: string,
  limit: number
): Promise<TSuggestedProduct[]> => {
  const productsOnOpenList = db
    .select({ productId: ongoingListItems.productId })
    .from(ongoingListItems)
    .innerJoin(
      ongoingLists,
      eq(ongoingListItems.ongoingListId, ongoingLists.id)
    )
    .where(
      and(
        eq(ongoingLists.householdId, householdId),
        inArray(ongoingLists.status, ['active', 'shopping'])
      )
    );

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
      updatedAt: products.updatedAt,
      addedCount: productUsageStats.totalAddedToOngoingCount,
      lastAddedAt: productUsageStats.lastAddedToOngoingAt
    })
    .from(productUsageStats)
    .innerJoin(products, eq(productUsageStats.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(productUsageStats.householdId, householdId),
        sql`${productUsageStats.totalAddedToOngoingCount} > 0`,
        notInArray(products.id, productsOnOpenList)
      )
    )
    .orderBy(
      sql`${productUsageStats.totalAddedToOngoingCount} desc`,
      sql`${productUsageStats.lastAddedToOngoingAt} asc nulls first`
    )
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
  getRecentCatalogProducts,
  getSuggestedProducts
};
