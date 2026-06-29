import { baseListItems, baseLists, db, eq } from '@myapp/db';
import type { TUnitKind } from '@myapp/shared';

type TBaseListMutationInput = {
  householdId: string;
  name: string;
  isEnabled: boolean;
  userId: string;
};

type TBaseListUpdateInput = {
  name: string;
  isEnabled: boolean;
};

type TBaseListItemMutationInput = {
  householdId: string;
  baseListId: string;
  productId: string;
  quantityAmount: number;
  quantityUnit: TUnitKind;
  userId: string;
};

type TBaseListItemQuantityInput = {
  quantityAmount: number;
  quantityUnit: TUnitKind;
};

const createBaseList = async (input: TBaseListMutationInput) => {
  const now = Date.now();
  const [baseList] = await db
    .insert(baseLists)
    .values({
      householdId: input.householdId,
      name: input.name,
      isEnabled: input.isEnabled,
      createdBy: input.userId,
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!baseList) {
    throw new Error('Failed to create base list');
  }

  return baseList;
};

const updateBaseList = async (
  baseListId: string,
  input: TBaseListUpdateInput
) => {
  const [baseList] = await db
    .update(baseLists)
    .set({
      name: input.name,
      isEnabled: input.isEnabled,
      updatedAt: Date.now()
    })
    .where(eq(baseLists.id, baseListId))
    .returning();

  if (!baseList) {
    throw new Error('Failed to update base list');
  }

  return baseList;
};

const removeBaseList = async (baseListId: string) => {
  const [baseList] = await db
    .delete(baseLists)
    .where(eq(baseLists.id, baseListId))
    .returning();

  if (!baseList) {
    throw new Error('Failed to remove base list');
  }

  return baseList;
};

const createBaseListItem = async (input: TBaseListItemMutationInput) => {
  const now = Date.now();
  const [item] = await db
    .insert(baseListItems)
    .values({
      householdId: input.householdId,
      baseListId: input.baseListId,
      productId: input.productId,
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit,
      createdBy: input.userId,
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!item) {
    throw new Error('Failed to create base list item');
  }

  return item;
};

const updateBaseListItem = async (
  itemId: string,
  input: TBaseListItemQuantityInput
) => {
  const [item] = await db
    .update(baseListItems)
    .set({
      quantityAmount: input.quantityAmount,
      quantityUnit: input.quantityUnit,
      updatedAt: Date.now()
    })
    .where(eq(baseListItems.id, itemId))
    .returning();

  if (!item) {
    throw new Error('Failed to update base list item');
  }

  return item;
};

const removeBaseListItem = async (itemId: string) => {
  const [item] = await db
    .delete(baseListItems)
    .where(eq(baseListItems.id, itemId))
    .returning();

  if (!item) {
    throw new Error('Failed to remove base list item');
  }

  return item;
};

export {
  createBaseList,
  createBaseListItem,
  removeBaseList,
  removeBaseListItem,
  updateBaseList,
  updateBaseListItem
};
export type {
  TBaseListItemMutationInput,
  TBaseListItemQuantityInput,
  TBaseListMutationInput,
  TBaseListUpdateInput
};
