import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import {
  defaultNamespace,
  fallbackLanguage,
  resources,
  supportedLanguages
} from './resources';

let initializationPromise: Promise<typeof i18next> | undefined;

const initI18n = () => {
  if (i18next.isInitialized) {
    return Promise.resolve(i18next);
  }

  initializationPromise ??= i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: fallbackLanguage,
      supportedLngs: [...supportedLanguages],
      defaultNS: defaultNamespace,
      ns: [defaultNamespace],
      interpolation: {
        escapeValue: false
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng'
      },
      react: {
        useSuspense: false
      }
    })
    .then(() => i18next);

  return initializationPromise;
};

export { i18next, initI18n };
