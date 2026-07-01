import type { TOngoingListEntry, TUnitKind } from '@myapp/shared';

const formatQuantity = (amount: number | string, unit: TUnitKind) => {
  const formattedAmount = Number(amount).toLocaleString(undefined, {
    maximumFractionDigits: 3
  });

  if (unit === 'unit') {
    return `${formattedAmount} units`;
  }

  return `${formattedAmount} ${unit}`;
};

const getGroupedItems = (items: TOngoingListEntry[]) => {
  const groups = new Map<string, TOngoingListEntry[]>();

  items.forEach((item) => {
    const categoryName = item.categoryName ?? 'Uncategorized';
    const groupItems = groups.get(categoryName) ?? [];

    groupItems.push(item);
    groups.set(categoryName, groupItems);
  });

  return Array.from(groups.entries()).map(([categoryName, groupItems]) => ({
    categoryName,
    items: groupItems
  }));
};

const vibrate = (pattern: VibratePattern) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

export { formatQuantity, getGroupedItems, vibrate };
