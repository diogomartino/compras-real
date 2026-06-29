import {
  and,
  baseListItems,
  baseLists,
  categories,
  db,
  eq,
  products,
  sql
} from '@myapp/db';
import type {
  TBaseListDetails,
  TBaseListEntry,
  TBaseListSummary
} from '@myapp/shared';

const getBaseLists = async (
  householdId: string
): Promise<TBaseListSummary[]> => {
  return db
    .select({
      id: baseLists.id,
      name: baseLists.name,
      isEnabled: baseLists.isEnabled,
      itemCount: sql<number>`count(${baseListItems.id})::int`,
      createdAt: baseLists.createdAt,
      updatedAt: baseLists.updatedAt
    })
    .from(baseLists)
    .leftJoin(baseListItems, eq(baseLists.id, baseListItems.baseListId))
    .where(eq(baseLists.householdId, householdId))
    .groupBy(baseLists.id)
    .orderBy(baseLists.name);
};

const getBaseListById = async (baseListId: string) => {
  const [baseList] = await db
    .select()
    .from(baseLists)
    .where(eq(baseLists.id, baseListId))
    .limit(1);

  return baseList;
};

const getBaseListByName = async (householdId: string, name: string) => {
  const [baseList] = await db
    .select({ id: baseLists.id })
    .from(baseLists)
    .where(
      and(
        eq(baseLists.householdId, householdId),
        sql`lower(${baseLists.name}) = lower(${name})`
      )
    )
    .limit(1);

  return baseList;
};

const getBaseListItems = async (
  householdId: string,
  baseListId: string
): Promise<TBaseListEntry[]> => {
  return db
    .select({
      id: baseListItems.id,
      baseListId: baseListItems.baseListId,
      productId: baseListItems.productId,
      title: products.title,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
      quantityAmount: baseListItems.quantityAmount,
      quantityUnit: baseListItems.quantityUnit,
      defaultQuantityAmount: products.defaultQuantityAmount,
      defaultQuantityUnit: products.defaultQuantityUnit,
      createdAt: baseListItems.createdAt,
      updatedAt: baseListItems.updatedAt
    })
    .from(baseListItems)
    .innerJoin(products, eq(baseListItems.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(baseListItems.householdId, householdId),
        eq(baseListItems.baseListId, baseListId)
      )
    );
};

const getBaseListDetails = async (
  householdId: string,
  baseListId: string
): Promise<TBaseListDetails | undefined> => {
  const baseList = await getBaseListById(baseListId);

  if (!baseList || baseList.householdId !== householdId) {
    return undefined;
  }

  const items = await getBaseListItems(householdId, baseListId);

  return {
    id: baseList.id,
    name: baseList.name,
    isEnabled: baseList.isEnabled,
    itemCount: items.length,
    createdAt: baseList.createdAt,
    updatedAt: baseList.updatedAt,
    items
  };
};

const getBaseListItemById = async (itemId: string) => {
  const [item] = await db
    .select()
    .from(baseListItems)
    .where(eq(baseListItems.id, itemId))
    .limit(1);

  return item;
};

const getBaseListItemForProduct = async (
  baseListId: string,
  productId: string
) => {
  const [item] = await db
    .select({ id: baseListItems.id })
    .from(baseListItems)
    .where(
      and(
        eq(baseListItems.baseListId, baseListId),
        eq(baseListItems.productId, productId)
      )
    )
    .limit(1);

  return item;
};

export {
  getBaseListById,
  getBaseListByName,
  getBaseListDetails,
  getBaseListItemById,
  getBaseListItemForProduct,
  getBaseListItems,
  getBaseLists
};
