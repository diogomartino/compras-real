import type { TScrappedData } from '@myapp/shared';
import { ContinenteScrapper } from './continente';
import { ScrapperId, type IScrapper } from './types';

const scrappers: Record<string, IScrapper> = {
  [ScrapperId.CONTINENTE]: new ContinenteScrapper()
};

const getScrapperFromUrl = (url: string): IScrapper | undefined => {
  return Object.values(scrappers).find((scrapper) =>
    url.startsWith(scrapper.baseUrl)
  );
};

const scrapUrl = (url: string): Promise<TScrappedData> => {
  const scrapper = getScrapperFromUrl(url);

  if (!scrapper) {
    throw new Error(`No scrapper found for URL: ${url}`);
  }

  return scrapper.scrap(url);
};

export { scrapUrl };
