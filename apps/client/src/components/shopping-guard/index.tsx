import { useIsAuthenticated } from '@/features/auth/hooks';
import { useShoppingList, useShoppingUpdates } from '@/queries/shopping';
import { memo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

const ShoppingGuard = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: shoppingList, isFetching } = useShoppingList(isAuthenticated);

  useShoppingUpdates(isAuthenticated);

  useEffect(() => {
    if (
      isAuthenticated &&
      !isFetching &&
      shoppingList?.status === 'shopping' &&
      !location.pathname.startsWith('/shop')
    ) {
      navigate('/shop');
    }
  }, [
    isAuthenticated,
    isFetching,
    location.pathname,
    navigate,
    shoppingList?.status
  ]);

  return null;
});

ShoppingGuard.displayName = 'ShoppingGuard';

export { ShoppingGuard };
