import {
  and,
  categories,
  db,
  eq,
  inArray,
  ongoingListItems,
  ongoingLists,
  products
} from '@myapp/db';
import type { TOngoingListDetails, TOngoingListEntry } from '@myapp/shared';

const getActiveOngoingList = async (householdId: string) => {
  const [ongoingList] = await db
    .select()
    .from(ongoingLists)
    .where(
      and(eq(ongoingLists.householdId, householdId), eq(ongoingLists.status, 'active'))
    )
    .limit(1);

  return ongoingList;
};

const getOpenOngoingList = async (householdId: string) => {
  const [ongoingList] = await db
    .select()
    .from(ongoingLists)
    .where(
      and(
        eq(ongoingLists.householdId, householdId),
        inArray(ongoingLists.status, ['active', 'shopping'])
      )
    )
    .limit(1);

  return ongoingList;
};

const getOngoingListItems = async (
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

const getOngoingListItemById = async (itemId: string) => {
  const [item] = await db
    .select()
    .from(ongoingListItems)
    .where(eq(ongoingListItems.id, itemId))
    .limit(1);

  return item;
};

const getOngoingListItemForProduct = async (
  ongoingListId: string,
  productId: string
) => {
  const [item] = await db
    .select({ id: ongoingListItems.id })
    .from(ongoingListItems)
    .where(
      and(
        eq(ongoingListItems.ongoingListId, ongoingListId),
        eq(ongoingListItems.productId, productId)
      )
    )
    .limit(1);

  return item;
};

const getOngoingListDetails = async (
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

  const items = await getOngoingListItems(householdId, ongoingList.id);

  return {
    id: ongoingList.id,
    status: ongoingList.status,
    itemCount: items.length,
    createdAt: ongoingList.createdAt,
    updatedAt: ongoingList.updatedAt,
    items
  };
};

export {
  getActiveOngoingList,
  getOpenOngoingList,
  getOngoingListDetails,
  getOngoingListItemById,
  getOngoingListItemForProduct,
  getOngoingListItems
};
