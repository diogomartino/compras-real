import { useIsAuthenticated } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import {
  useAddProduct,
  useDeleteProduct,
  useExtractProductDetails,
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
import { useTranslation } from 'react-i18next';
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
  TCatalogProduct,
  TStoreSearchResult
} from './types';

const Catalog = memo(() => {
  const { t } = useTranslation();
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
  const { mutateAsync: deleteProduct, isPending: deleteProductPending } =
    useDeleteProduct();
  const {
    mutateAsync: extractProductDetails,
    isPending: extractProductDetailsPending
  } = useExtractProductDetails();

  const [query, setQuery] = useState('');
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
      if (!normalizedQuery) {
        return true;
      }

      return `${product.title} ${product.categoryName ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [products, query]);

  const isMutating = useMemo(
    () => addProductPending || updateProductPending || deleteProductPending,
    [addProductPending, deleteProductPending, updateProductPending]
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

  const onSelectSearchResult = useCallback(
    (result: TStoreSearchResult) => {
      resetErrors();
      setValues((currentForm) => ({
        ...currentForm,
        title: result.name,
        imageUrl: result.imageUrl,
        categoryName: result.category ?? '',
        sourceUrl: result.url ?? ''
      }));
    },
    [resetErrors, setValues]
  );

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
        title: details.name || currentForm.title,
        imageUrl: details.imageUrl || currentForm.imageUrl,
        categoryName: details.category || currentForm.categoryName,
        sourceUrl: url
      }));

      toast.success(t('catalog.detailsExtracted'));
    } catch (error) {
      const extractedErrors = parseTrpcErrors(error);

      setErrors({
        sourceUrl:
          extractedErrors.url ??
          extractedErrors._general ??
          t('catalog.failedToExtractDetails')
      });
    }
  }, [
    extractProductDetails,
    values.sourceUrl,
    resetErrors,
    setErrors,
    setValues,
    t
  ]);

  const submitForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetErrors();

      const input = getCatalogInput(values);

      try {
        if (!formMode || formMode.type === 'create') {
          await addProduct(input);

          toast.success(t('catalog.productCreated'));
        } else {
          await updateProduct({ ...input, id: formMode.id });

          toast.success(t('catalog.productUpdated'));
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
      t,
      updateProduct
    ]
  );

  const remove = useCallback(
    async (productId: string) => {
      const product = products.find(
        (currentProduct) => currentProduct.id === productId
      );
      const confirmed = await requestConfirmation({
        title: t('catalog.deleteProductTitle'),
        message: product
          ? t('catalog.deleteProductMessage', { title: product.title })
          : t('catalog.deleteProductFallback'),
        confirmLabel: t('common.delete'),
        cancelLabel: t('common.cancel'),
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await deleteProduct(productId);
        toast.success(t('catalog.productDeleted'));
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? t('catalog.failedToDeleteProduct')
        );
      }
    },
    [deleteProduct, products, t]
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
        onSelectSearchResult={onSelectSearchResult}
      />
    );
  }

  return (
    <main className="bg-background text-foreground">
      <CatalogList
        products={visibleProducts}
        query={query}
        isLoading={productsLoading}
        isMutating={isMutating}
        errorMessage={productsError?.message}
        onQueryChange={onQueryChange}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={remove}
      />
    </main>
  );
});

Catalog.displayName = 'Catalog';

export { Catalog };
