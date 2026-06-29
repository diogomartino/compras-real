import { getBrowser } from '../browser';
import {
  scrappedProduct,
  ScrapperId,
  type IScrapper,
  type TScrappedProduct
} from '../types';
import {
  getCategory,
  getImageUrl,
  getName,
  waitForCookieConsent
} from './helpers';

class ContinenteScrapper implements IScrapper {
  public id = ScrapperId.CONTINENTE;
  public baseUrl = 'https://www.continente.pt';

  public scrap = async (url: string): Promise<TScrappedProduct> => {
    const browser = await getBrowser();

    const page = await browser.newPage();

    await page.goto(url);

    await waitForCookieConsent(page);

    const name = await getName(page);
    const imageUrl = await getImageUrl(page);
    const category = await getCategory(page);

    await browser.close();

    return scrappedProduct.parse({
      name,
      imageUrl,
      category
    });
  };
}

export { ContinenteScrapper };
