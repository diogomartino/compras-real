import type { TUnitKind } from "./tables";

type TBaseListSummary = {
  id: string;
  name: string;
  isEnabled: boolean;
  itemCount: number;
  createdAt: number;
  updatedAt: number;
};

type TBaseListEntry = {
  id: string;
  baseListId: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  categoryName: string | null;
  quantityAmount: number;
  quantityUnit: TUnitKind;
  defaultQuantityAmount: number;
  defaultQuantityUnit: TUnitKind;
  createdAt: number;
  updatedAt: number;
};

type TBaseListDetails = TBaseListSummary & {
  items: TBaseListEntry[];
};

export type { TBaseListDetails, TBaseListEntry, TBaseListSummary };
