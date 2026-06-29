import { AppBottomNav } from '@/components/app-bottom-nav';
import { useIsAuthenticated } from '@/features/auth/hooks';
import { requestConfirmation } from '@/features/dialogs/actions';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { useForm } from '@/hooks/use-form';
import {
  useAddBaseListItem,
  useCreateBaseList,
  useRemoveBaseList,
  useRemoveBaseListItem,
  useUpdateBaseList,
  useUpdateBaseListItem
} from '@/mutations/base-list';
import { useBaseListDetails, useBaseLists } from '@/queries/base-list';
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
import { BaseListForm } from './base-list-form';
import { BaseListList } from './base-list-list';
import { BaseListManagementForm } from './base-list-management-form';
import { BaseListOverview } from './base-list-overview';
import {
  emptyBaseListForm,
  emptyBaseListItemForm,
  getAvailableProducts,
  getBaseListFormValues,
  getBaseListInput,
  getBaseListItemFormValues,
  getBaseListItemInput,
  getGroupedBaseListItems
} from './helpers';
import type {
  TBaseListEntry,
  TBaseListFormMode,
  TBaseListFormValues,
  TBaseListItemFormMode,
  TBaseListItemFormValues,
  TBaseListSummary,
  TCatalogProduct
} from './types';

const BaseList = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const {
    data: baseListsData,
    error: baseListsError,
    isLoading: baseListsLoading
  } = useBaseLists(isAuthenticated);
  const [selectedBaseListId, setSelectedBaseListId] = useState<
    string | undefined
  >();
  const {
    data: selectedBaseListData,
    error: selectedBaseListError,
    isLoading: selectedBaseListLoading
  } = useBaseListDetails(selectedBaseListId, isAuthenticated);
  const { data: productsData, isLoading: productsLoading } =
    useProducts(isAuthenticated);
  const { mutateAsync: createBaseList, isPending: createBaseListPending } =
    useCreateBaseList();
  const { mutateAsync: updateBaseList, isPending: updateBaseListPending } =
    useUpdateBaseList();
  const { mutateAsync: removeBaseList, isPending: removeBaseListPending } =
    useRemoveBaseList();
  const { mutateAsync: addBaseListItem, isPending: addBaseListItemPending } =
    useAddBaseListItem();
  const {
    mutateAsync: updateBaseListItem,
    isPending: updateBaseListItemPending
  } = useUpdateBaseListItem();
  const {
    mutateAsync: removeBaseListItem,
    isPending: removeBaseListItemPending
  } = useRemoveBaseListItem();

  const [query, setQuery] = useState('');
  const [listFormMode, setListFormMode] = useState<
    TBaseListFormMode | undefined
  >();
  const [itemFormMode, setItemFormMode] = useState<
    TBaseListItemFormMode | undefined
  >();
  const {
    values: listValues,
    errors: listErrors,
    setValues: setListValues,
    setErrors: setListErrors,
    resetErrors: resetListErrors,
    onChange: onListChange
  } = useForm<TBaseListFormValues>(emptyBaseListForm);
  const {
    values: itemValues,
    errors: itemErrors,
    setValues: setItemValues,
    setErrors: setItemErrors,
    resetErrors: resetItemErrors,
    onChange: onItemChange
  } = useForm<TBaseListItemFormValues>(emptyBaseListItemForm);

  const baseLists = useMemo(
    () => (baseListsData ?? []) as TBaseListSummary[],
    [baseListsData]
  );
  const selectedBaseList = useMemo(
    () => selectedBaseListData,
    [selectedBaseListData]
  );
  const products = useMemo(
    () => (productsData ?? []) as TCatalogProduct[],
    [productsData]
  );
  const baseListItems = useMemo(
    () => selectedBaseList?.items ?? [],
    [selectedBaseList]
  );
  const productOptions = useMemo(
    () => getAvailableProducts(products, baseListItems),
    [baseListItems, products]
  );
  const itemFormProductOptions = useMemo(
    () => (itemFormMode?.type === 'edit' ? products : productOptions),
    [itemFormMode?.type, productOptions, products]
  );
  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return baseListItems;
    }

    return baseListItems.filter((item) =>
      `${item.title} ${item.categoryName ?? ''}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [baseListItems, query]);
  const groups = useMemo(
    () => getGroupedBaseListItems(visibleItems),
    [visibleItems]
  );
  const isMutating = useMemo(
    () =>
      createBaseListPending ||
      updateBaseListPending ||
      removeBaseListPending ||
      addBaseListItemPending ||
      updateBaseListItemPending ||
      removeBaseListItemPending,
    [
      addBaseListItemPending,
      createBaseListPending,
      removeBaseListItemPending,
      removeBaseListPending,
      updateBaseListItemPending,
      updateBaseListPending
    ]
  );

  const closeListForm = useCallback(() => {
    setListValues(emptyBaseListForm);
    resetListErrors();
    setListFormMode(undefined);
  }, [resetListErrors, setListValues]);

  const closeItemForm = useCallback(() => {
    setItemValues(emptyBaseListItemForm);
    resetItemErrors();
    setItemFormMode(undefined);
  }, [resetItemErrors, setItemValues]);

  const openCreateList = useCallback(() => {
    setListValues(emptyBaseListForm);
    resetListErrors();
    setListFormMode({ type: 'create' });
  }, [resetListErrors, setListValues]);

  const openEditList = useCallback(
    (baseList: TBaseListSummary) => {
      setListValues(getBaseListFormValues(baseList));
      resetListErrors();
      setListFormMode({ type: 'edit', id: baseList.id });
    },
    [resetListErrors, setListValues]
  );

  const openBaseList = useCallback((baseList: TBaseListSummary) => {
    setQuery('');
    setSelectedBaseListId(baseList.id);
  }, []);

  const closeBaseList = useCallback(() => {
    setQuery('');
    setSelectedBaseListId(undefined);
  }, []);

  const openCreateItem = useCallback(() => {
    if (!selectedBaseList) {
      return;
    }

    setItemValues(emptyBaseListItemForm);
    resetItemErrors();
    setItemFormMode({
      type: 'create',
      baseListId: selectedBaseList.id,
      baseListName: selectedBaseList.name
    });
  }, [resetItemErrors, selectedBaseList, setItemValues]);

  const openEditItem = useCallback(
    (item: TBaseListEntry) => {
      setItemValues(getBaseListItemFormValues(item));
      resetItemErrors();
      setItemFormMode({
        type: 'edit',
        id: item.id,
        baseListId: item.baseListId,
        productName: item.title
      });
    },
    [resetItemErrors, setItemValues]
  );

  const onQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const onProductChange = useCallback(
    (productId: string) => {
      const selectedProduct = products.find(
        (product) => product.id === productId
      );

      setItemValues({
        productId,
        quantityAmount: selectedProduct
          ? String(selectedProduct.defaultQuantityAmount)
          : '1',
        quantityUnit: selectedProduct?.defaultQuantityUnit ?? 'unit'
      });
      resetItemErrors();
    },
    [products, resetItemErrors, setItemValues]
  );

  const submitListForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetListErrors();

      const input = getBaseListInput(listValues);

      try {
        if (!listFormMode || listFormMode.type === 'create') {
          await createBaseList(input);
          toast.success('Base List created.');
        } else {
          await updateBaseList({ ...input, id: listFormMode.id });
          toast.success('Base List updated.');
        }

        closeListForm();
      } catch (error) {
        setListErrors(parseTrpcErrors(error));
      }
    },
    [
      closeListForm,
      createBaseList,
      listFormMode,
      listValues,
      resetListErrors,
      setListErrors,
      updateBaseList
    ]
  );

  const submitItemForm = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      resetItemErrors();

      if (!itemFormMode) {
        return;
      }

      const input = getBaseListItemInput(itemValues);

      try {
        if (itemFormMode.type === 'create') {
          await addBaseListItem({
            ...input,
            baseListId: itemFormMode.baseListId
          });
          toast.success('Product added to the Base List.');
        } else {
          await updateBaseListItem({
            id: itemFormMode.id,
            baseListId: itemFormMode.baseListId,
            quantityAmount: input.quantityAmount,
            quantityUnit: input.quantityUnit
          });
          toast.success('Base List quantity updated.');
        }

        closeItemForm();
      } catch (error) {
        setItemErrors(parseTrpcErrors(error));
      }
    },
    [
      addBaseListItem,
      closeItemForm,
      itemFormMode,
      itemValues,
      resetItemErrors,
      setItemErrors,
      updateBaseListItem
    ]
  );

  const removeList = useCallback(
    async (baseList: TBaseListSummary) => {
      const confirmed = await requestConfirmation({
        title: 'Delete Base List?',
        message: `Delete ${baseList.name}? Products in the catalog will stay available.`,
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await removeBaseList(baseList.id);

        if (selectedBaseListId === baseList.id) {
          closeBaseList();
        }

        toast.success('Base List deleted.');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to delete Base List.'
        );
      }
    },
    [closeBaseList, removeBaseList, selectedBaseListId]
  );

  const removeItem = useCallback(
    async (item: TBaseListEntry) => {
      const confirmed = await requestConfirmation({
        title: 'Remove product?',
        message: `Remove ${item.title} from this Base List?`,
        confirmLabel: 'Remove',
        cancelLabel: 'Cancel',
        variant: 'danger'
      });

      if (!confirmed) {
        return;
      }

      try {
        await removeBaseListItem({ id: item.id, baseListId: item.baseListId });
        toast.success('Product removed from the Base List.');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to remove product.'
        );
      }
    },
    [removeBaseListItem]
  );

  if (!isAuthenticated) {
    return <HomeAuthScreen />;
  }

  if (listFormMode) {
    return (
      <BaseListManagementForm
        formMode={listFormMode}
        values={listValues}
        errors={listErrors}
        isPending={isMutating}
        onCancel={closeListForm}
        onSubmit={submitListForm}
        onFieldChange={onListChange}
      />
    );
  }

  if (itemFormMode) {
    return (
      <BaseListForm
        formMode={itemFormMode}
        values={itemValues}
        productOptions={itemFormProductOptions}
        errors={itemErrors}
        isPending={isMutating}
        onCancel={closeItemForm}
        onSubmit={submitItemForm}
        onProductChange={onProductChange}
        onFieldChange={onItemChange}
      />
    );
  }

  if (selectedBaseList) {
    return (
      <main className="min-h-dvh bg-background pb-28 text-foreground">
        <BaseListList
          baseList={selectedBaseList}
          groups={groups}
          query={query}
          isLoading={selectedBaseListLoading || productsLoading}
          isMutating={isMutating}
          errorMessage={selectedBaseListError?.message}
          onBack={closeBaseList}
          onQueryChange={onQueryChange}
          onCreate={openCreateItem}
          onEdit={openEditItem}
          onRemove={removeItem}
        />
        <AppBottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-background pb-28 text-foreground">
      <BaseListOverview
        baseLists={baseLists}
        isLoading={baseListsLoading}
        isMutating={isMutating}
        errorMessage={baseListsError?.message}
        onCreate={openCreateList}
        onOpen={openBaseList}
        onEdit={openEditList}
        onRemove={removeList}
      />
      <AppBottomNav />
    </main>
  );
});

BaseList.displayName = 'BaseList';

export { BaseList };
