import type { Page } from 'playwright';
import { ScrapperId, type TSearchProduct } from '../types';

const waitForCookieConsent = async (page: Page): Promise<void> => {
  await page.waitForSelector(
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    {
      state: 'visible'
    }
  );
  await page.click('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
};

const getName = async (page: Page) => {
  await page.waitForSelector('.product-name', {
    state: 'visible'
  });

  const name = await page.textContent('.product-name');

  return name!
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .replace('Continente', '')
    .trim();
};

const getPrice = async (page: Page) => {
  await page.waitForSelector('.pwc-tile--price-primary', {
    state: 'visible'
  });

  const price = await page.textContent('.pwc-tile--price-primary');
  const priceNumber = parseFloat(price!.replace('€', '').replace(',', '.'));

  return priceNumber;
};

const getImageUrl = async (page: Page) => {
  await page.waitForSelector('.zoom-image', {
    state: 'visible'
  });

  const imageUrl = await page.getAttribute('.zoom-image', 'src');

  return imageUrl!;
};

const getCategory = async (page: Page) => {
  const url = page.url();

  const category = url.split('/')[5];

  if (!category) {
    throw new Error('Category not found in URL');
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getProducts = async (page: Page): Promise<TSearchProduct[]> => {
  await page.waitForSelector('.product', {
    state: 'visible'
  });

  const products = await page.$$eval(
    '.product',
    (elements, args) => {
      const { source, baseUrl } = args;

      return elements.map((element) => {
        const getSearchProductUrl = () => {
          const linkElement = element.querySelector('.product-name-link a');

          if (!linkElement) {
            throw new Error('Link element not found');
          }

          const href = linkElement.getAttribute('href');

          if (!href) {
            throw new Error('Href not found');
          }

          return `${baseUrl}${href}`;
        };

        const getSearchProductName = () => {
          const nameElement = element.querySelector('.product-name-link');

          if (!nameElement) {
            throw new Error('Name element not found');
          }

          const name = nameElement.textContent;

          return name?.replace(/\n/g, '').replace(/\t/g, '').trim() ?? null;
        };

        const getSearchProductImageUrl = () => {
          // find img with "product-tile-component-image" class and get src attribute
          const imageElement = element.querySelector(
            '.product-tile-component-image'
          );

          if (!imageElement) {
            throw new Error('Image element not found');
          }

          const imageUrl = imageElement.getAttribute('src');

          if (!imageUrl) {
            throw new Error('Image url not found');
          }

          return imageUrl;
        };

        const getSearchProductCategory = () => {
          const categoryElement = element.querySelector('.product-name-link a');

          if (!categoryElement) {
            throw new Error('Category element not found');
          }

          const categoryHref = categoryElement.getAttribute('href');

          if (!categoryHref) {
            throw new Error('Category href not found');
          }

          const category = categoryHref.split('/')[3];

          if (!category) {
            throw new Error('Category not found in href');
          }

          return category
            .split('-')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        };

        const searchProduct: TSearchProduct = {
          name: getSearchProductName(),
          imageUrl: getSearchProductImageUrl(),
          category: getSearchProductCategory(),
          url: getSearchProductUrl(),
          source
        };

        return searchProduct;
      });
    },
    { source: ScrapperId.PINGO_DOCE, baseUrl: 'https://www.pingodoce.pt' }
  );

  return products;
};

export {
  getCategory,
  getImageUrl,
  getName,
  getPrice,
  getProducts,
  waitForCookieConsent
};
