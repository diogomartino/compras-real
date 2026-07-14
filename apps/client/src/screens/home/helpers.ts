import type { TOngoingListEntry, TUnitKind } from '@myapp/shared';

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

const getGroupedOngoingListItems = (
  items: TOngoingListEntry[],
  uncategorizedLabel: string,
  categoryOrder?: string[]
) => {
  const groups = new Map<string, TOngoingListEntry[]>();

  items.forEach((item) => {
    const categoryName = item.categoryName ?? uncategorizedLabel;
    const groupItems = groups.get(categoryName) ?? [];

    groupItems.push(item);
    groups.set(categoryName, groupItems);
  });

  // Follow the household's aisle order when provided; uncategorized last.
  const hasOrder = !!categoryOrder && categoryOrder.length > 0;
  const orderIndex = (name: string) => {
    if (name === uncategorizedLabel) {
      return Number.MAX_SAFE_INTEGER;
    }

    const index = hasOrder ? categoryOrder!.indexOf(name) : -1;

    return index === -1 ? Number.MAX_SAFE_INTEGER - 1 : index;
  };

  return Array.from(groups.entries())
    .map(([categoryName, groupItems]) => ({
      categoryName,
      items: groupItems.sort((firstItem, secondItem) =>
        firstItem.title.localeCompare(secondItem.title)
      )
    }))
    .sort((firstGroup, secondGroup) => {
      if (hasOrder) {
        return (
          orderIndex(firstGroup.categoryName) -
          orderIndex(secondGroup.categoryName)
        );
      }

      if (firstGroup.categoryName === uncategorizedLabel) {
        return 1;
      }

      if (secondGroup.categoryName === uncategorizedLabel) {
        return -1;
      }

      return firstGroup.categoryName.localeCompare(secondGroup.categoryName);
    });
};

export { formatQuantity, getGroupedOngoingListItems, unitOptions };
