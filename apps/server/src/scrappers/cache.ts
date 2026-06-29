import type { TScrappedProduct } from './types';

const CACHE_FOR_HOURS = 1;

class ScrapperCache {
  private cache: Map<string, { data: TScrappedProduct; timestamp: number }>;

  constructor() {
    this.cache = new Map();
  }

  public get(url: string): TScrappedProduct | null {
    const cachedEntry = this.cache.get(url);

    if (!cachedEntry) {
      return null;
    }

    const currentTime = Date.now();
    const elapsedTimeInHours =
      (currentTime - cachedEntry.timestamp) / (1000 * 60 * 60);

    if (elapsedTimeInHours > CACHE_FOR_HOURS) {
      this.cache.delete(url);
      return null;
    }

    return cachedEntry.data;
  }

  public set(url: string, data: TScrappedProduct): void {
    this.cache.set(url, { data, timestamp: Date.now() });
  }
}

const scrapperCache = new ScrapperCache();

export { scrapperCache };
