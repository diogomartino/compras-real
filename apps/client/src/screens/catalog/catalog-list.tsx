import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FolderTree, PackageSearch, Plus, Search } from 'lucide-react';
import { memo, type ChangeEvent } from 'react';
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
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Surface radius="2xl" padding="md">
          <Inline justify="between" className="gap-3">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={onQueryChange}
                className="h-11 rounded-xl pl-9"
                placeholder="Search products or categories"
              />
            </div>
            <Inline gap="sm" wrap={false}>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/categories">
                  <FolderTree className="size-4" />
                  <span className="sr-only sm:not-sr-only">Categories</span>
                </Link>
              </Button>
              <Button onClick={onCreate} className="rounded-xl">
                <Plus className="size-4" />
                Add product
              </Button>
            </Inline>
          </Inline>
        </Surface>

        {errorMessage && (
          <Surface radius="2xl" padding="md" variant="muted">
            <Text tone="destructive">{errorMessage}</Text>
          </Surface>
        )}

        <Stack gap="sm">
          {isLoading && (
            <Surface radius="2xl" padding="lg">
              <Text tone="muted">Loading products...</Text>
            </Surface>
          )}

          {!isLoading &&
            products.map((product) => (
              <CatalogProductRow
                key={product.id}
                product={product}
                isMutating={isMutating}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

          {!isLoading && products.length === 0 && (
            <Surface radius="2xl" padding="lg" className="text-center">
              <Stack gap="sm" align="center">
                <PackageSearch className="size-8 text-muted-foreground" />
                <Text weight="semibold">No products found</Text>
                <Text size="sm" tone="muted">
                  Try a different search or add a product manually.
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
