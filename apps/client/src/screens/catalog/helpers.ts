import type { TUnitKind } from '@myapp/shared';
import type { TCatalogFormValues, TCatalogProduct } from './types';

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

const emptyCatalogForm: TCatalogFormValues = {
  title: '',
  imageUrl: '',
  categoryName: '',
  defaultQuantityAmount: '1',
  defaultQuantityUnit: 'unit',
  sourceUrl: ''
};

const formatUnit = (unit: TUnitKind) => {
  if (unit === 'unit') {
    return 'units';
  }

  return unit;
};

const getProductFormValues = (
  product: TCatalogProduct
): TCatalogFormValues => ({
  title: product.title,
  imageUrl: product.imageUrl ?? '',
  categoryName: product.categoryName ?? '',
  defaultQuantityAmount: String(product.defaultQuantityAmount),
  defaultQuantityUnit: product.defaultQuantityUnit,
  sourceUrl: product.sourceUrl ?? ''
});

const getCatalogCategories = (products: TCatalogProduct[]) => {
  return Array.from(
    new Set(
      products
        .map((product) => product.categoryName?.trim() ?? '')
        .filter((category) => category.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));
};

const getCatalogInput = (form: TCatalogFormValues) => ({
  title: form.title.trim(),
  imageUrl: form.imageUrl.trim() || null,
  categoryName: form.categoryName.trim() || null,
  defaultQuantityAmount: Number(form.defaultQuantityAmount),
  defaultQuantityUnit: form.defaultQuantityUnit,
  sourceUrl: form.sourceUrl.trim() || null
});

export {
  emptyCatalogForm,
  formatUnit,
  getCatalogCategories,
  getCatalogInput,
  getProductFormValues,
  unitOptions
};
