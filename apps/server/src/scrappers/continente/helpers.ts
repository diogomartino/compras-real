import type { Page } from 'playwright';

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
  await page.waitForSelector('.ct-product-image', {
    state: 'visible'
  });

  const imageUrl = await page.getAttribute('.ct-product-image', 'src');

  return imageUrl!;
};

const getCategory = async (page: Page) => {
  await page.waitForSelector('.breadcrumbs-item', {
    state: 'visible'
  });

  const category = await page.$$eval('.breadcrumbs-item', (elements) => {
    if (elements.length < 3) {
      return null;
    }

    return elements[2].textContent;
  });

  return category?.replace(/\n/g, '').replace(/\t/g, '').trim() ?? null;
};

export { getCategory, getImageUrl, getName, getPrice, waitForCookieConsent };
