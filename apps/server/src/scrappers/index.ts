import { scrapperCache } from './cache';
import { ContinenteScrapper } from './continente';
import { PingoDoceScrapper } from './pingo-doce';
import {
  ScrapperId,
  type IScrapper,
  type TScrappedProduct,
  type TSearchProduct
} from './types';

const scrappers: Record<string, IScrapper> = {
  [ScrapperId.CONTINENTE]: new ContinenteScrapper(),
  [ScrapperId.PINGO_DOCE]: new PingoDoceScrapper()
};

const normalizeUrl = (url: string): string => {
  try {
    const normalizedUrl = new URL(url);

    normalizedUrl.search = '';
    normalizedUrl.hash = '';

    return normalizedUrl.toString();
  } catch (error) {
    throw new Error('Invalid URL', { cause: error });
  }
};

const getScrapperFromUrl = (url: string): IScrapper | undefined => {
  const origin = new URL(url).origin;

  return Object.values(scrappers).find(
    (scrapper) => origin === new URL(scrapper.baseUrl).origin
  );
};

const scrapUrl = async (url: string): Promise<TScrappedProduct> => {
  const normalizedUrl = normalizeUrl(url);

  const cachedProduct = scrapperCache.get(normalizedUrl);

  if (cachedProduct) {
    return cachedProduct;
  }

  const scrapper = getScrapperFromUrl(normalizedUrl);

  if (!scrapper) {
    throw new Error('No scrapper found for URL');
  }

  const scrappedProduct = await scrapper.scrap(normalizedUrl);

  scrapperCache.set(normalizedUrl, scrappedProduct);

  return scrappedProduct;
};

const SEARCH_CACHE_TTL_MS = 60 * 60 * 1000;
const searchCache = new Map<string, { data: TSearchProduct[]; ts: number }>();

const scrapSearch = async (query: string): Promise<TSearchProduct[]> => {
  const cacheKey = query.trim().toLowerCase();
  const cached = searchCache.get(cacheKey);

  if (cached && Date.now() - cached.ts < SEARCH_CACHE_TTL_MS) {
    return cached.data;
  }

  const scrappedProducts: TSearchProduct[] = [];

  for (const scrapper of Object.values(scrappers)) {
    if (scrapper.search) {
      const products = await scrapper.search(query);

      scrappedProducts.push(...products);
    }
  }

  searchCache.set(cacheKey, { data: scrappedProducts, ts: Date.now() });

  return scrappedProducts;
};

export { scrapSearch, scrapUrl };
