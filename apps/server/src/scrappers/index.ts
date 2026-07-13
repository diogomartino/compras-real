import { scrapperCache } from './cache';
import { ContinenteScrapper } from './continente';
import { ScrapperId, type IScrapper, type TScrappedProduct } from './types';

const scrappers: Record<string, IScrapper> = {
  [ScrapperId.CONTINENTE]: new ContinenteScrapper()
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

export { scrapUrl };
