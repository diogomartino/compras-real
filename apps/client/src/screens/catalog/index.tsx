import { AppBottomNav } from '@/components/app-bottom-nav';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import {
  useAddProduct,
  useArchiveProduct,
  useExtractProductDetails,
  useRestoreProduct,
  useUpdateProduct
} from '@/mutations/products';
import { useProducts } from '@/queries/products';
import { HomeAuthScreen } from '@/screens/home/home-auth-screen';
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { toast } from 'sonner';
import { CatalogForm } from './catalog-form';
import { CatalogList } from './catalog-list';
import {
  emptyCatalogForm,
  getCatalogCategories,
  getCatalogInput,
  getProductFormValues
} from './helpers';
import type {
  TCatalogFormMode,
  TCatalogFormValues,
  TCatalogProduct
} from './types';

const Catalog = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading
  } = useProducts(isAuthenticated);
  const { mutateAsync: addProduct, isPending: addProductPending } =
    useAddProduct();
  const { mutateAsync: updateProduct, isPending: updateProductPending } =
    useUpdateProduct();
  const { mutateAsync: archiveProduct, isPending: archiveProductPending } =
    useArchiveProduct();
  const { mutateAsync: restoreProduct, isPending: restoreProductPending } =
    useRestoreProduct();
  const {
    mutateAsync: extractProductDetails,
    isPending: extractProductDetailsPending
  } = useExtractProductDetails();

  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [formMode, setFormMode] = useState<TCatalogFormMode | undefined>();
  const { values, errors, setValues, setErrors, resetErrors, onChange } =
    useForm<TCatalogFormValues>(emptyCatalogForm);

  const products = useMemo(
    () => (productsData ?? []) as TCatalogProduct[],
    [productsData]
  );
  const categories = useMemo(() => getCatalogCategories(products), [products]);
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      if (!showArchived && product.isArchived) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return `${product.title} ${product.categoryName ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [products, query, showArchived]);

  const isMutating = useMemo(
    () =>
      addProductPending ||
      updateProductPending ||
      archiveProductPending ||
      restoreProductPending,
    [
      addProductPending,
      archiveProductPending,
      restoreProductPending,
      updateProductPending
    ]
  );
  const formIsPending = useMemo(
    () => addProductPending || updateProductPending,
    [addProductPending, updateProductPending]
  );

  const closeForm = useCallback(() => {
    setValues(emptyCatalogForm);
    resetErrors();
    setFormMode(undefined);
  }, [resetErrors, setValues]);

  const openCreate = useCallback(() => {
    setValues(emptyCatalogForm);
    resetErrors();
    setFormMode({ type: 'create' });
  }, [resetErrors, setValues]);

  const openEdit = useCallback(
    (product: TCatalogProduct) => {
      setValues(getProductFormValues(product));
      resetErrors();
      setFormMode({ type: 'edit', id: product.id });
    },
    [resetErrors, setValues]
  );

  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const onToggleArchived = useCallback(() => {
    setShowArchived((currentShowArchived) => !currentShowArchived);
  }, []);

  const onImportUrlChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange('sourceUrl', event.target.value);
    },
    [onChange]
  );

  const extractDetails = useCallback(async () => {
    const url = values.sourceUrl.trim();

    try {
      resetErrors();

      const details = await extractProductDetails({ url });

      setValues((currentForm) => ({
        ...currentForm,
        title: details.title || currentForm.title,
        imageUrl: details.imageUrl || currentForm.imageUrl,
        sourceUrl: url
      }));

      toast.success('Product details extracted.');
    } catch (error) {
      const extractedErrors = parseTrpcErrors(error);

      setErrors({
        sourceUrl:
          extractedErrors.url ??
          extractedErrors._general ??
          'Failed to extract details'
      });
    }
  }, [
    extractProductDetails,
    values.sourceUrl,
    resetErrors,
    setErrors,
    setValues
  ]);

  const submitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetErrors();

      const input = getCatalogInput(values);

      try {
        if (!formMode || formMode.type === 'create') {
          await addProduct(input);

          toast.success('Product created.');
        } else {
          await updateProduct({ ...input, id: formMode.id });

          toast.success('Product updated.');
        }

        closeForm();
      } catch (error) {
        setErrors(parseTrpcErrors(error));
      }
    },
    [
      addProduct,
      closeForm,
      values,
      formMode,
      resetErrors,
      setErrors,
      updateProduct
    ]
  );

  const archive = useCallback(
    async (productId: string) => {
      const product = products.find(
        (currentProduct) => currentProduct.id === productId
      );
      const confirmed = await requestConfirmation({
        title: 'Archive product?',
        message: product
          ? `Archive ${product.title}? It will be hidden from the catalog by default.`
          : 'Archive this product? It will be hidden from the catalog by default.',
        confirmLabel: 'Archive',
        cancelLabel: 'Cancel',
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await archiveProduct(productId);
        toast.success('Product archived.');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to archive product.'
        );
      }
    },
    [archiveProduct, products]
  );

  const restore = useCallback(
    async (productId: string) => {
      try {
        await restoreProduct(productId);
        toast.success('Product restored.');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to restore product.'
        );
      }
    },
    [restoreProduct]
  );

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  if (formMode) {
    return (
      <CatalogForm
        formMode={formMode}
        values={values}
        categories={categories}
        errors={errors}
        isPending={formIsPending}
        isExtracting={extractProductDetailsPending}
        onCancel={closeForm}
        onSubmit={submitForm}
        onImportUrlChange={onImportUrlChange}
        onExtractDetails={extractDetails}
        onFieldChange={onChange}
      />
    );
  }

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <CatalogList
        products={visibleProducts}
        query={query}
        showArchived={showArchived}
        isLoading={productsLoading}
        isMutating={isMutating}
        errorMessage={productsError?.message}
        onQueryChange={onQueryChange}
        onToggleArchived={onToggleArchived}
        onCreate={openCreate}
        onEdit={openEdit}
        onArchive={archive}
        onRestore={restore}
      />
      <AppBottomNav />
    </main>
  );
});

Catalog.displayName = 'Catalog';

export { Catalog };
