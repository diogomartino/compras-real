import { Inline, ListSkeleton, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderTree, PackageSearch, Plus, Search } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { memo, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { CatalogProductRow } from './catalog-product-row';
import type { TCatalogProduct } from './types';

type TCatalogListProps = {
  products: TCatalogProduct[];
  query: string;
  isLoading: boolean;
  isMutating: boolean;
  errorMessage?: string;
  onQueryChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCreate: () => void;
  onEdit: (product: TCatalogProduct) => void;
  onDelete: (productId: string) => void;
};

const CatalogList = memo(
  ({
    products,
    query,
    isLoading,
    isMutating,
    errorMessage,
    onQueryChange,
    onCreate,
    onEdit,
    onDelete
  }: TCatalogListProps) => {
    const { t } = useTranslation();
    const reduceMotion = useReducedMotion();

    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <Surface radius="xl" padding="md" className="bg-card/85">
          <Inline justify="between" className="gap-3">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={onQueryChange}
                className="pl-9"
                placeholder={t('catalog.search')}
              />
            </div>
            <Inline gap="sm" wrap={false}>
              <Button asChild variant="outline">
                <Link to="/categories">
                  <FolderTree className="size-4" />
                  <span className="sr-only sm:not-sr-only">
                    {t('catalog.categories')}
                  </span>
                </Link>
              </Button>
              <Button onClick={onCreate}>
                <Plus className="size-4" />
                {t('catalog.addProduct')}
              </Button>
            </Inline>
          </Inline>
        </Surface>

        {errorMessage && (
          <Surface radius="xl" padding="md" variant="muted">
            <Text tone="destructive">{errorMessage}</Text>
          </Surface>
        )}

        <Stack gap="sm">
          {isLoading && <ListSkeleton />}

          {!isLoading && (
            <AnimatePresence initial={false} mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.95, x: -24 }
                  }
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <CatalogProductRow
                    product={product}
                    isMutating={isMutating}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {!isLoading && products.length === 0 && (
            <Surface radius="xl" padding="lg" className="text-center">
              <Stack gap="sm" align="center">
                <PackageSearch className="size-8 text-muted-foreground" />
                <Text weight="semibold">{t('catalog.noProductsFound')}</Text>
                <Text size="sm" tone="muted">
                  {t('catalog.tryDifferentSearch')}
                </Text>
              </Stack>
            </Surface>
          )}
        </Stack>
      </div>
    );
  }
);

CatalogList.displayName = 'CatalogList';

export { CatalogList };
