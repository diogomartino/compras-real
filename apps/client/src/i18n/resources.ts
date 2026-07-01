import enCommon from './locales/en/common.json';
import ptCommon from './locales/pt/common.json';

const defaultNamespace = 'common';
const supportedLanguages = ['en', 'pt'] as const;
const fallbackLanguage = 'en';

const resources = {
  en: {
    common: enCommon
  },
  pt: {
    common: ptCommon
  }
} as const;

type TSupportedLanguage = (typeof supportedLanguages)[number];
type TTranslationNamespace = typeof defaultNamespace;

export { defaultNamespace, fallbackLanguage, resources, supportedLanguages };
export type { TSupportedLanguage, TTranslationNamespace };
