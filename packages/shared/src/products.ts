import type { TUnitKind } from './tables';

type TCatalogProduct = {
  id: string;
  title: string;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  defaultQuantityAmount: number;
  defaultQuantityUnit: TUnitKind;
  sourceUrl: string | null;
  createdAt: number;
  updatedAt: number;
};

export type { TCatalogProduct };
