import { TRPCError } from '@trpc/server';

type TBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, TBucket>();

let lastSweep = 0;

const sweep = (now: number) => {
  if (now - lastSweep < 60_000) {
    return;
  }

  lastSweep = now;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
};

const enforceRateLimit = (
  key: string,
  limit: number,
  windowMs: number
): void => {
  const now = Date.now();

  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many attempts. Please wait a moment and try again.'
    });
  }

  bucket.count += 1;
};

export { enforceRateLimit };
