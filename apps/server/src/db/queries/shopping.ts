import {
  and,
  baseListItems,
  baseLists,
  categories,
  db,
  eq,
  ongoingListItems,
  ongoingLists,
  products
} from '@myapp/db';
import type { TOngoingListDetails, TOngoingListEntry } from '@myapp/shared';

const getShoppingOngoingList = async (householdId: string) => {
  const [ongoingList] = await db
    .select()
    .from(ongoingLists)
    .where(
      and(
        eq(ongoingLists.householdId, householdId),
        eq(ongoingLists.status, 'shopping')
      )
    )
    .limit(1);

  return ongoingList;
};

const getShoppingListItems = async (
  householdId: string,
  ongoingListId: string
): Promise<TOngoingListEntry[]> => {
  return db
    .select({
      id: ongoingListItems.id,
      ongoingListId: ongoingListItems.ongoingListId,
      productId: ongoingListItems.productId,
      title: products.title,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
      quantityAmount: ongoingListItems.quantityAmount,
      quantityUnit: ongoingListItems.quantityUnit,
      status: ongoingListItems.status,
      statusUpdatedAt: ongoingListItems.statusUpdatedAt,
      statusUpdatedBy: ongoingListItems.statusUpdatedBy,
      defaultQuantityAmount: products.defaultQuantityAmount,
      defaultQuantityUnit: products.defaultQuantityUnit,
      createdAt: ongoingListItems.createdAt,
      updatedAt: ongoingListItems.updatedAt
    })
    .from(ongoingListItems)
    .innerJoin(products, eq(ongoingListItems.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(ongoingListItems.householdId, householdId),
        eq(ongoingListItems.ongoingListId, ongoingListId)
      )
    );
};

const getShoppingListDetails = async (
  householdId: string,
  ongoingListId: string
): Promise<TOngoingListDetails | undefined> => {
  const [ongoingList] = await db
    .select()
    .from(ongoingLists)
    .where(eq(ongoingLists.id, ongoingListId))
    .limit(1);

  if (!ongoingList || ongoingList.householdId !== householdId) {
    return undefined;
  }

  const items = await getShoppingListItems(householdId, ongoingList.id);

  return {
    id: ongoingList.id,
    status: ongoingList.status,
    itemCount: items.length,
    createdAt: ongoingList.createdAt,
    updatedAt: ongoingList.updatedAt,
    items
  };
};

const getEnabledBaseListItemsForSeed = async (householdId: string) => {
  return db
    .select({
      productId: baseListItems.productId,
      quantityAmount: baseListItems.quantityAmount,
      quantityUnit: baseListItems.quantityUnit
    })
    .from(baseListItems)
    .innerJoin(baseLists, eq(baseListItems.baseListId, baseLists.id))
    .where(
      and(
        eq(baseListItems.householdId, householdId),
        eq(baseLists.isEnabled, true)
      )
    );
};

export {
  getEnabledBaseListItemsForSeed,
  getShoppingListDetails,
  getShoppingListItems,
  getShoppingOngoingList
};
