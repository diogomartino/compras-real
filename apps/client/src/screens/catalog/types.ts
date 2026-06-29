import type { TUnitKind } from '@myapp/shared';
export type { TCatalogProduct } from '@myapp/shared';

type TCatalogFormValues = {
  title: string;
  imageUrl: string;
  categoryName: string;
  defaultQuantityAmount: string;
  defaultQuantityUnit: TUnitKind;
  sourceUrl: string;
};

type TCatalogFormMode =
  | {
      type: 'create';
    }
  | {
      type: 'edit';
      id: string;
    };

export type { TCatalogFormMode, TCatalogFormValues };
