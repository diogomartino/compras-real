import { EmptyState, Grid, Media, Text } from '@/components/ds';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useStoreSearch } from '@/queries/products';
import { PackageSearch, Search } from 'lucide-react';
import { memo, useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TStoreSearchResult } from './types';

type TCatalogSearchProps = {
  onSelect: (result: TStoreSearchResult) => void;
};

const formatSource = (source: string) =>
  source
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const CatalogSearch = memo(({ onSelect }: TCatalogSearchProps) => {
  const { t } = useTranslation();
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedTerm(term), 1000);

    return () => clearTimeout(timeout);
  }, [term]);

  const {
    data: results,
    isFetching,
    error
  } = useStoreSearch(debouncedTerm, true);

  const onTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const showPrompt = debouncedTerm.trim().length < 2;
  const showEmpty =
    !showPrompt && !isFetching && !error && (results?.length ?? 0) === 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={onTermChange}
          className="pl-9"
          autoFocus
          placeholder={t('catalog.storeSearch.placeholder')}
        />
      </div>

      {error && (
        <Text tone="destructive" role="alert">
          {t('catalog.storeSearch.error')}
        </Text>
      )}

      {showPrompt && (
        <EmptyState
          variant="muted"
          icon={<Search className="size-5" />}
          title={t('catalog.storeSearch.prompt')}
        />
      )}

      {!showPrompt && isFetching && (
        <Grid
          columns="two"
          gap="sm"
          className="max-h-[calc(100dvh-15rem)] overflow-y-auto overscroll-contain pr-1"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </Grid>
      )}

      {showEmpty && (
        <EmptyState
          variant="muted"
          icon={<PackageSearch className="size-5" />}
          title={t('catalog.storeSearch.noResults')}
        />
      )}

      {!showPrompt && !isFetching && (results?.length ?? 0) > 0 && (
        <Grid
          columns="two"
          gap="sm"
          className="max-h-[calc(100dvh-15rem)] overflow-y-auto overscroll-contain pr-1"
        >
          {results?.map((result, index) => (
            <button
              key={`${result.source}-${index}-${result.name}`}
              type="button"
              onClick={() => onSelect(result)}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/75 p-3 text-left shadow-sm shadow-black/5 transition active:scale-[0.97]"
            >
              <Media src={result.imageUrl} alt={result.name} size="md" />
              <div className="min-w-0 space-y-1.5">
                <Text size="sm" weight="medium" className="line-clamp-2">
                  {result.name}
                </Text>
                <img
                  src={`/brands/${result.source}.svg`}
                  alt={formatSource(result.source)}
                  className="h-4 w-auto max-w-24 object-contain object-left"
                />
              </div>
            </button>
          ))}
        </Grid>
      )}
    </div>
  );
});

CatalogSearch.displayName = 'CatalogSearch';

export { CatalogSearch };
