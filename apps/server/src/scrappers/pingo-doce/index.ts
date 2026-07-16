import { getBrowser } from '../browser';
import {
  scrappedProduct,
  ScrapperId,
  type IScrapper,
  type TScrappedProduct,
  type TSearchProduct
} from '../types';
import { getCategory, getImageUrl, getName, getProducts } from './helpers';

class PingoDoceScrapper implements IScrapper {
  public id = ScrapperId.PINGO_DOCE;
  public baseUrl = 'https://www.pingodoce.pt';

  public scrap = async (url: string): Promise<TScrappedProduct> => {
    const browser = await getBrowser();

    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      const name = await getName(page);
      const imageUrl = await getImageUrl(page);
      const category = await getCategory(page);

      return scrappedProduct.parse({
        name,
        imageUrl,
        category
      });
    } finally {
      await browser.close();
    }
  };

  public search = async (query: string): Promise<TSearchProduct[]> => {
    const browser = await getBrowser();

    try {
      // https://www.pingodoce.pt/on/demandware.store/Sites-pingo-doce-Site/default/Search-Show?q=coca%2520cola

      const searchUrl = new URL(
        `${this.baseUrl}/on/demandware.store/Sites-pingo-doce-Site/default/Search-Show`
      );

      searchUrl.searchParams.set('q', query);

      console.log(`searching url: ${searchUrl.toString()}`);

      const page = await browser.newPage();

      await page.goto(searchUrl.toString(), {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      return await getProducts(page);
    } finally {
      await browser.close();
    }

    return [];
  };
}

export { PingoDoceScrapper };
