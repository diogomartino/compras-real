import { scrapperCache } from './cache';
import { ContinenteScrapper } from './continente';
import { ScrapperId, type IScrapper, type TScrappedProduct } from './types';

const scrappers: Record<string, IScrapper> = {
  [ScrapperId.CONTINENTE]: new ContinenteScrapper()
};

const getScrapperFromUrl = (url: string): IScrapper | undefined => {
  return Object.values(scrappers).find((scrapper) =>
    url.startsWith(scrapper.baseUrl)
  );
};

const scrapUrl = async (url: string): Promise<TScrappedProduct> => {
  const cachedProduct = scrapperCache.get(url);

  if (cachedProduct) {
    return cachedProduct;
  }

  const scrapper = getScrapperFromUrl(url);

  if (!scrapper) {
    throw new Error(`No scrapper found for URL: ${url}`);
  }

  const scrappedProduct = await scrapper.scrap(url);

  return scrappedProduct;
};

export { scrapUrl };
