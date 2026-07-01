import { db, productUsageStats, sql } from '@myapp/db';
import type { TOngoingListItemStatus } from '@myapp/shared';

type TTrackProductUsageInput = {
  householdId: string;
  productId: string;
  usedAt?: number;
};

const createBaseUsageValues = (input: TTrackProductUsageInput) => {
  const now = input.usedAt ?? Date.now();

  return {
    householdId: input.householdId,
    productId: input.productId,
    totalAddedToOngoingCount: 0,
    totalCheckedCount: 0,
    totalSkippedCount: 0,
    totalDiscardedCount: 0,
    createdAt: now,
    updatedAt: now
  };
};

const trackProductAddedToOngoing = async (input: TTrackProductUsageInput) => {
  const now = input.usedAt ?? Date.now();

  await db
    .insert(productUsageStats)
    .values({
      ...createBaseUsageValues({ ...input, usedAt: now }),
      totalAddedToOngoingCount: 1,
      lastAddedToOngoingAt: now,
      lastUsedAt: now
    })
    .onConflictDoUpdate({
      target: [productUsageStats.householdId, productUsageStats.productId],
      set: {
        totalAddedToOngoingCount: sql`${productUsageStats.totalAddedToOngoingCount} + 1`,
        lastAddedToOngoingAt: now,
        lastUsedAt: now,
        updatedAt: now
      }
    });
};

const trackProductShoppingStatus = async (
  input: TTrackProductUsageInput & { status: TOngoingListItemStatus }
) => {
  const now = input.usedAt ?? Date.now();

  if (input.status === 'pending') {
    return;
  }

  await db
    .insert(productUsageStats)
    .values({
      ...createBaseUsageValues({ ...input, usedAt: now }),
      totalCheckedCount: input.status === 'checked' ? 1 : 0,
      totalSkippedCount: input.status === 'ignored' ? 1 : 0,
      totalDiscardedCount: input.status === 'discarded' ? 1 : 0,
      lastCheckedAt: input.status === 'checked' ? now : null,
      lastSkippedAt: input.status === 'ignored' ? now : null,
      lastDiscardedAt: input.status === 'discarded' ? now : null,
      lastUsedAt: now
    })
    .onConflictDoUpdate({
      target: [productUsageStats.householdId, productUsageStats.productId],
      set: {
        totalCheckedCount:
          input.status === 'checked'
            ? sql`${productUsageStats.totalCheckedCount} + 1`
            : productUsageStats.totalCheckedCount,
        totalSkippedCount:
          input.status === 'ignored'
            ? sql`${productUsageStats.totalSkippedCount} + 1`
            : productUsageStats.totalSkippedCount,
        totalDiscardedCount:
          input.status === 'discarded'
            ? sql`${productUsageStats.totalDiscardedCount} + 1`
            : productUsageStats.totalDiscardedCount,
        lastCheckedAt:
          input.status === 'checked' ? now : productUsageStats.lastCheckedAt,
        lastSkippedAt:
          input.status === 'ignored' ? now : productUsageStats.lastSkippedAt,
        lastDiscardedAt:
          input.status === 'discarded'
            ? now
            : productUsageStats.lastDiscardedAt,
        lastUsedAt: now,
        updatedAt: now
      }
    });
};

export { trackProductAddedToOngoing, trackProductShoppingStatus };
