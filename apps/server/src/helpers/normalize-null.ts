const normalizeNull = (value: string | null | undefined) => {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
};

export { normalizeNull };
