type TPaginationCursor = {
  id: string;
  value: number;
};

type TPaginatedResult<TItem> = {
  items: TItem[];
  nextCursor: TPaginationCursor | null;
};

export type { TPaginatedResult, TPaginationCursor };
