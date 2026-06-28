enum LocalStorageKey {
  VITE_UI_THEME = 'vite-ui-theme',
  TOKEN = 'token'
}

const getLocalStorageItem = (key: LocalStorageKey): string | null => {
  return localStorage.getItem(key);
};

const getLocalStorageItemAsJSON = <T>(
  key: LocalStorageKey,
  defaultValue: T | undefined = undefined
): T | undefined => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item) as T;
  }

  return defaultValue;
};

const setLocalStorageItemAsJSON = <T>(key: LocalStorageKey, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const setLocalStorageItem = (key: LocalStorageKey, value: string): void => {
  localStorage.setItem(key, value);
};

const removeLocalStorageItem = (key: LocalStorageKey): void => {
  localStorage.removeItem(key);
};

export {
  LocalStorageKey,
  getLocalStorageItem,
  getLocalStorageItemAsJSON,
  removeLocalStorageItem,
  setLocalStorageItem,
  setLocalStorageItemAsJSON
};
