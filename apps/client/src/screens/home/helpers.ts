import type { TUnitKind } from '@myapp/shared';
import type { TOngoingListEntry } from '@myapp/shared';

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

const formatQuantity = (amount: number | string, unit: TUnitKind) => {
  const formattedAmount = Number(amount).toLocaleString(undefined, {
    maximumFractionDigits: 3
  });

  if (unit === 'unit') {
    return `${formattedAmount} units`;
  }

  return `${formattedAmount} ${unit}`;
};

const getGroupedOngoingListItems = (items: TOngoingListEntry[]) => {
  const groups = new Map<string, TOngoingListEntry[]>();

  items.forEach((item) => {
    const categoryName = item.categoryName ?? 'Uncategorized';
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
      if (firstGroup.categoryName === 'Uncategorized') {
        return 1;
      }

      if (secondGroup.categoryName === 'Uncategorized') {
        return -1;
      }

      return firstGroup.categoryName.localeCompare(secondGroup.categoryName);
    });
};

export { formatQuantity, getGroupedOngoingListItems, unitOptions };
