import type { TUnitKind } from '@myapp/shared';
import type {
  TBaseListEntry,
  TBaseListFormValues,
  TBaseListItemFormValues,
  TBaseListSummary,
  TCatalogProduct
} from './types';

const unitOptions: TUnitKind[] = [
  'unit',
  'kg',
  'g',
  'liter',
  'ml',
  'pack',
  'bottle',
  'box',
  'other'
];

const emptyBaseListForm: TBaseListFormValues = {
  name: '',
  isEnabled: true
};

const emptyBaseListItemForm: TBaseListItemFormValues = {
  productId: '',
  quantityAmount: '1',
  quantityUnit: 'unit'
};

const formatUnit = (unit: TUnitKind) => {
  if (unit === 'unit') {
    return 'units';
  }

  return unit;
};

const formatQuantity = (amount: number | string, unit: TUnitKind) => {
  return `${amount} ${formatUnit(unit)}`;
};

const getBaseListInput = (form: TBaseListFormValues) => ({
  name: form.name.trim(),
  isEnabled: form.isEnabled
});

const getBaseListFormValues = (
  baseList: TBaseListSummary
): TBaseListFormValues => ({
  name: baseList.name,
  isEnabled: baseList.isEnabled
});

const getBaseListItemInput = (form: TBaseListItemFormValues) => ({
  productId: form.productId,
  quantityAmount: Number(form.quantityAmount),
  quantityUnit: form.quantityUnit
});

const getBaseListItemFormValues = (
  item: TBaseListEntry
): TBaseListItemFormValues => ({
  productId: item.productId,
  quantityAmount: String(item.quantityAmount),
  quantityUnit: item.quantityUnit
});

const getAvailableProducts = (
  products: TCatalogProduct[],
  baseListItems: TBaseListEntry[]
) => {
  const baseListProductIds = new Set(
    baseListItems.map((item) => item.productId)
  );

  return products
    .filter((product) => !baseListProductIds.has(product.id))
    .sort((firstProduct, secondProduct) =>
      firstProduct.title.localeCompare(secondProduct.title)
    );
};

const getGroupedBaseListItems = (
  items: TBaseListEntry[],
  uncategorizedLabel: string
) => {
  const groups = new Map<string, TBaseListEntry[]>();

  items.forEach((item) => {
    const categoryName = item.categoryName ?? uncategorizedLabel;
    const groupItems = groups.get(categoryName) ?? [];

    groupItems.push(item);
    groups.set(categoryName, groupItems);
  });

  return Array.from(groups.entries())
    .map(([categoryName, groupItems]) => ({
      categoryName,
      items: groupItems.sort((firstItem, secondItem) =>
        firstItem.title.localeCompare(secondItem.title)
      )
    }))
    .sort((firstGroup, secondGroup) => {
      if (firstGroup.categoryName === uncategorizedLabel) {
        return 1;
      }

      if (secondGroup.categoryName === uncategorizedLabel) {
        return -1;
      }

      return firstGroup.categoryName.localeCompare(secondGroup.categoryName);
    });
};

export {
  emptyBaseListForm,
  emptyBaseListItemForm,
  formatQuantity,
  formatUnit,
  getAvailableProducts,
  getBaseListFormValues,
  getBaseListInput,
  getBaseListItemFormValues,
  getBaseListItemInput,
  getGroupedBaseListItems,
  unitOptions
};
