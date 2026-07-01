import { and, db, eq, ongoingListItems, ongoingLists } from '@myapp/db';
import type { TOngoingListItemStatus, TUnitKind } from '@myapp/shared';

type TSeedItem = {
  productId: string;
  quantityAmount: number;
  quantityUnit: TUnitKind;
};

const startShoppingList = async (ongoingListId: string, userId: string) => {
  const now = Date.now();
  const [ongoingList] = await db
    .update(ongoingLists)
    .set({
      status: 'shopping',
      shoppingStartedAt: now,
      shoppingStartedBy: userId,
      updatedAt: now
    })
    .where(
      and(eq(ongoingLists.id, ongoingListId), eq(ongoingLists.status, 'active'))
    )
    .returning();

  if (!ongoingList) {
    throw new Error('Failed to start shopping');
  }

  return ongoingList;
};

const setShoppingItemStatus = async (
  itemId: string,
  status: TOngoingListItemStatus,
  userId: string
) => {
  const now = Date.now();
  const [item] = await db
    .update(ongoingListItems)
    .set({
      status,
      statusUpdatedAt: now,
      statusUpdatedBy: userId,
      updatedAt: now
    })
    .where(eq(ongoingListItems.id, itemId))
    .returning();

  if (!item) {
    throw new Error('Failed to update shopping item');
  }

  return item;
};

const cancelShoppingList = async (ongoingListId: string) => {
  const now = Date.now();

  return db.transaction(async (tx) => {
    const [ongoingList] = await tx
      .update(ongoingLists)
      .set({
        status: 'active',
        shoppingStartedAt: null,
        shoppingStartedBy: null,
        updatedAt: now
      })
      .where(
        and(
          eq(ongoingLists.id, ongoingListId),
          eq(ongoingLists.status, 'shopping')
        )
      )
      .returning();

    if (!ongoingList) {
      throw new Error('Failed to cancel shopping');
    }

    await tx
      .update(ongoingListItems)
      .set({
        status: 'pending',
        statusUpdatedAt: null,
        statusUpdatedBy: null,
        updatedAt: now
      })
      .where(eq(ongoingListItems.ongoingListId, ongoingListId));

    return ongoingList;
  });
};

const finishShoppingList = async (
  ongoingListId: string,
  householdId: string,
  userId: string,
  seedItems: TSeedItem[]
) => {
  const now = Date.now();

  return db.transaction(async (tx) => {
    const [finishedList] = await tx
      .update(ongoingLists)
      .set({
        status: 'finished',
        finishedAt: now,
        finishedBy: userId,
        updatedAt: now
      })
      .where(
        and(
          eq(ongoingLists.id, ongoingListId),
          eq(ongoingLists.status, 'shopping')
        )
      )
      .returning();

    if (!finishedList) {
      throw new Error('Failed to finish shopping');
    }

    const [newList] = await tx
      .insert(ongoingLists)
      .values({
        householdId,
        status: 'active',
        createdBy: userId,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    if (!newList) {
      throw new Error('Failed to create new ongoing list');
    }

    const uniqueSeedItems = Array.from(
      new Map(seedItems.map((item) => [item.productId, item])).values()
    );

    if (uniqueSeedItems.length > 0) {
      await tx.insert(ongoingListItems).values(
        uniqueSeedItems.map((item) => ({
          householdId,
          ongoingListId: newList.id,
          productId: item.productId,
          quantityAmount: item.quantityAmount,
          quantityUnit: item.quantityUnit,
          status: 'pending' as const,
          createdBy: userId,
          createdAt: now,
          updatedAt: now
        }))
      );
    }

    return { finishedList, newList };
  });
};

export {
  cancelShoppingList,
  finishShoppingList,
  setShoppingItemStatus,
  startShoppingList
};
