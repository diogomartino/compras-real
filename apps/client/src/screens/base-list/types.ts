import type { TUnitKind } from '@myapp/shared';

export type {
  TBaseListDetails,
  TBaseListEntry,
  TBaseListSummary,
  TCatalogProduct
} from '@myapp/shared';

type TBaseListFormValues = {
  name: string;
  isEnabled: boolean;
};

type TBaseListItemFormValues = {
  productId: string;
  quantityAmount: string;
  quantityUnit: TUnitKind;
};

type TBaseListFormMode =
  | {
      type: 'create';
    }
  | {
      type: 'edit';
      id: string;
    };

type TBaseListItemFormMode =
  | {
      type: 'create';
      baseListId: string;
      baseListName: string;
    }
  | {
      type: 'edit';
      id: string;
      baseListId: string;
      productName: string;
    };

export type {
  TBaseListFormMode,
  TBaseListFormValues,
  TBaseListItemFormMode,
  TBaseListItemFormValues
};
