import { i18next } from './config';
import { fallbackLanguage, supportedLanguages, type TSupportedLanguage } from './resources';

const isSupportedLanguage = (language: string): language is TSupportedLanguage => {
  return supportedLanguages.includes(language as TSupportedLanguage);
};

const normalizeLanguage = (language: string | undefined): TSupportedLanguage => {
  const normalizedLanguage = language?.split('-')[0]?.toLowerCase();

  if (normalizedLanguage && isSupportedLanguage(normalizedLanguage)) {
    return normalizedLanguage;
  }

  return fallbackLanguage;
};

const getCurrentLanguage = (): TSupportedLanguage => {
  return normalizeLanguage(i18next.resolvedLanguage ?? i18next.language);
};

const changeLanguage = async (language: TSupportedLanguage) => {
  await i18next.changeLanguage(language);
};

export { changeLanguage, getCurrentLanguage, isSupportedLanguage, normalizeLanguage };
