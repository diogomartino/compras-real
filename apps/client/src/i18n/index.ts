export { i18next, initI18n } from './config';
export {
  changeLanguage,
  getCurrentLanguage,
  isSupportedLanguage,
  normalizeLanguage
} from './helpers';
export {
  defaultNamespace,
  fallbackLanguage,
  resources,
  supportedLanguages
} from './resources';
export type { TSupportedLanguage, TTranslationNamespace } from './resources';
export { I18nextProvider, Trans, useTranslation } from 'react-i18next';
