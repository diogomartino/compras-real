import type { TOngoingListEntry, TUnitKind } from '@myapp/shared';

type TAudioWindow = Window & {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
};

const formatQuantity = (amount: number | string, unit: TUnitKind) => {
  const formattedAmount = Number(amount).toLocaleString(undefined, {
    maximumFractionDigits: 3
  });

  if (unit === 'unit') {
    return `${formattedAmount} units`;
  }

  return `${formattedAmount} ${unit}`;
};

const getGroupedItems = (
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

  const entries = Array.from(groups.entries()).map(
    ([categoryName, groupItems]) => ({
      categoryName,
      items: groupItems
    })
  );

  if (!categoryOrder || categoryOrder.length === 0) {
    return entries;
  }

  const orderIndex = (name: string) => {
    if (name === uncategorizedLabel) {
      return Number.MAX_SAFE_INTEGER;
    }

    const index = categoryOrder.indexOf(name);

    return index === -1 ? Number.MAX_SAFE_INTEGER - 1 : index;
  };

  return entries.sort(
    (first, second) =>
      orderIndex(first.categoryName) - orderIndex(second.categoryName)
  );
};

const vibrate = (pattern: VibratePattern) => {
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    return navigator.vibrate(pattern);
  }

  return false;
};

const playActionTone = (status: 'checked' | 'ignored' | 'discarded') => {
  const audioWindow = window as TAudioWindow;
  const AudioContextClass =
    audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = status === 'checked' ? 660 : 220;
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.14);
  oscillator.addEventListener('ended', () => {
    context.close().catch(() => undefined);
  });
};

export { formatQuantity, getGroupedItems, playActionTone, vibrate };
