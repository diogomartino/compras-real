import { db, eq, products } from '@myapp/db';
import type { TUnitKind } from '@myapp/shared';
import { getOrCreateCategoryId } from './categories';

type TProductMutationInput = {
  householdId: string;
  title: string;
  imageUrl: string | null;
  categoryName: string | null;
  defaultQuantityAmount: number;
  defaultQuantityUnit: TUnitKind;
  sourceUrl: string | null;
  isArchived: boolean;
  userId: string;
};

const createProduct = async (input: TProductMutationInput) => {
  const now = Date.now();
  const categoryId = await getOrCreateCategoryId(
    input.householdId,
    input.categoryName,
    now
  );

  const [product] = await db
    .insert(products)
    .values({
      householdId: input.householdId,
      title: input.title,
      imageUrl: input.imageUrl,
      categoryId,
      unitKind: input.defaultQuantityUnit,
      defaultQuantityAmount: input.defaultQuantityAmount,
      defaultQuantityUnit: input.defaultQuantityUnit,
      sourceUrl: input.sourceUrl,
      isArchived: input.isArchived,
      createdAt: now,
      updatedAt: now
    })
    .returning();

  if (!product) {
    throw new Error('Failed to create product');
  }

  return product;
};

const updateProduct = async (
  productId: string,
  input: TProductMutationInput
) => {
  const now = Date.now();
  const categoryId = await getOrCreateCategoryId(
    input.householdId,
    input.categoryName,
    now
  );

  const [product] = await db
    .update(products)
    .set({
      title: input.title,
      imageUrl: input.imageUrl,
      categoryId,
      unitKind: input.defaultQuantityUnit,
      defaultQuantityAmount: input.defaultQuantityAmount,
      defaultQuantityUnit: input.defaultQuantityUnit,
      sourceUrl: input.sourceUrl,
      isArchived: input.isArchived,
      updatedAt: now
    })
    .where(eq(products.id, productId))
    .returning();

  if (!product) {
    throw new Error('Failed to update product');
  }

  return product;
};

const setProductArchived = async (productId: string, isArchived: boolean) => {
  const [product] = await db
    .update(products)
    .set({
      isArchived,
      updatedAt: Date.now()
    })
    .where(eq(products.id, productId))
    .returning();

  if (!product) {
    throw new Error('Failed to update product archive state');
  }

  return product;
};

export { createProduct, setProductArchived, updateProduct };
export type { TProductMutationInput };
