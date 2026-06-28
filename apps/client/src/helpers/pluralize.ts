const pluralize = (count: number, singular: string, plural: string): string => {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
};

export { pluralize };
