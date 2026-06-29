import type { Browser, BrowserContext } from 'playwright';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

const SCRAPING_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const getBrowser = async (headless: boolean = true): Promise<Browser> => {
  return chromium.launch({
    headless,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-gpu',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--window-size=1365,768'
    ]
  });
};

const getScrapingContext = async (
  browser: Browser
): Promise<BrowserContext> => {
  const context = await browser.newContext({
    acceptDownloads: false,
    colorScheme: 'light',
    deviceScaleFactor: 1,
    extraHTTPHeaders: {
      'Accept-Language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Upgrade-Insecure-Requests': '1',
      'sec-ch-ua':
        '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"'
    },
    hasTouch: false,
    ignoreHTTPSErrors: true,
    javaScriptEnabled: true,
    locale: 'pt-PT',
    timezoneId: 'Europe/Lisbon',
    userAgent: SCRAPING_USER_AGENT,
    viewport: {
      width: 1365,
      height: 768
    }
  });

  await context.addInitScript(`
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['pt-PT', 'pt', 'en-US', 'en']
    });

    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        {
          name: 'Chrome PDF Plugin',
          filename: 'internal-pdf-viewer',
          description: 'Portable Document Format'
        },
        {
          name: 'Chrome PDF Viewer',
          filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai',
          description: ''
        },
        {
          name: 'Native Client',
          filename: 'internal-nacl-plugin',
          description: ''
        }
      ]
    });

    window.chrome = window.chrome ?? {
      runtime: {}
    };

    const originalQuery = window.navigator.permissions.query;

    window.navigator.permissions.query = (parameters) => {
      if (parameters.name === 'notifications') {
        return Promise.resolve({
          state: Notification.permission,
          name: 'notifications',
          onchange: null,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false
        });
      }

      return originalQuery.call(window.navigator.permissions, parameters);
    };
  `);

  context.setDefaultTimeout(30_000);
  context.setDefaultNavigationTimeout(45_000);

  return context;
};

export { getBrowser, getScrapingContext };
