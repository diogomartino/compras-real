import { db, eq, ongoingListItems, ongoingLists } from '@myapp/db';
import type { TUnitKind } from '@myapp/shared';

type TOngoingListItemMutationInput = {
  householdId: string;
  ongoingListId: string;
  productId: string;
  quantityAmount: number;
  quantityUnit: TUnitKind;
  userId: string;
};

type TOngoingListItemQuantityInput = {
  quantityAmount: number;
  quantityUnit: TUnitKind;
};

const createOngoingList = async (householdId: string, userId: string) => {
  const now = Date.now();
  const [ongoingList] = await db
    .insert(ongoingLists)
    .values({
      householdId,
      status: 'active',
      createdBy: userId,
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!ongoingList) {
    throw new Error('Failed to create ongoing list');
  }

  return ongoingList;
};

const createOngoingListItem = async (input: TOngoingListItemMutationInput) => {
  const now = Date.now();
  const [item] = await db
    .insert(ongoingListItems)
    .values({
      householdId: input.householdId,
      ongoingListId: input.ongoingListId,
      productId: input.productId,
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit,
      createdBy: input.userId,
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!item) {
    throw new Error('Failed to create ongoing list item');
  }

  return item;
};

const updateOngoingListItem = async (
  itemId: string,
  input: TOngoingListItemQuantityInput
) => {
  const [item] = await db
    .update(ongoingListItems)
    .set({
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit,
      updatedAt: Date.now()
    })
    .where(eq(ongoingListItems.id, itemId))
    .returning();

  if (!item) {
    throw new Error('Failed to update ongoing list item');
  }

  return item;
};

const removeOngoingListItem = async (itemId: string) => {
  const [item] = await db
    .delete(ongoingListItems)
    .where(eq(ongoingListItems.id, itemId))
    .returning();

  if (!item) {
    throw new Error('Failed to remove ongoing list item');
  }

  return item;
};

export {
  createOngoingList,
  createOngoingListItem,
  removeOngoingListItem,
  updateOngoingListItem
};
export type { TOngoingListItemMutationInput, TOngoingListItemQuantityInput };
