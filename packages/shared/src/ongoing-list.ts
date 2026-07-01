import type { TUnitKind } from './tables';

type TOngoingListStatus = 'active' | 'shopping' | 'finished';
type TOngoingListItemStatus = 'pending' | 'checked' | 'ignored' | 'discarded';

type TOngoingListEntry = {
  id: string;
  ongoingListId: string;
  productId: string;
  title: string;
  imageUrl: string | null;
  categoryName: string | null;
  quantityAmount: number;
  quantityUnit: TUnitKind;
  status: TOngoingListItemStatus;
  statusUpdatedAt: number | null;
  statusUpdatedBy: string | null;
  defaultQuantityAmount: number;
  defaultQuantityUnit: TUnitKind;
  createdAt: number;
  updatedAt: number;
};

type TOngoingListDetails = {
  id: string;
  status: TOngoingListStatus;
  itemCount: number;
  createdAt: number;
  updatedAt: number;
  items: TOngoingListEntry[];
};

export type {
  TOngoingListDetails,
  TOngoingListEntry,
  TOngoingListItemStatus,
  TOngoingListStatus
};
