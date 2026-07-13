import { StartShoppingDialog } from '@/components/start-shopping-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { cn } from '@/lib/utils';
import { useStartShopping } from '@/mutations/shopping';
import { useOngoingList } from '@/queries/ongoing-list';
import {
  CircleUserRound,
  Home,
  ListChecks,
  PackageSearch,
  ShoppingCart
} from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

type TAppBottomNavProps = Record<string, never>;

const AppBottomNav = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { avatarUrl } = useAuth();
  const [startShoppingDialogOpen, setStartShoppingDialogOpen] = useState(false);
  const { data: ongoingList, isLoading: ongoingListLoading } =
    useOngoingList(true);
  const { mutateAsync: startShopping, isPending: startShoppingPending } =
    useStartShopping();

  const openStartShoppingDialog = useCallback(() => {
    setStartShoppingDialogOpen(true);
  }, []);
  const reviewList = useCallback(() => {
    setStartShoppingDialogOpen(false);
    navigate('/');
  }, [navigate]);
  const addProducts = useCallback(() => {
    setStartShoppingDialogOpen(false);
    navigate('/?addProducts=1');
  }, [navigate]);
  const shop = useCallback(async () => {
    try {
      await startShopping();
      setStartShoppingDialogOpen(false);
      navigate('/shop');
    } catch (error) {
      toast.error(
        parseTrpcErrors(error)._general ??
          t('components.bottomNav.failedToStartShopping')
      );
    }
  }, [navigate, startShopping, t]);

  const isHome = location.pathname === '/';
  const isBaseList = location.pathname.startsWith('/base-list');
  const isCatalog =
    location.pathname.startsWith('/catalog') ||
    location.pathname.startsWith('/categories');
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/94 px-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:border-x">
        <div className="grid grid-cols-5 gap-1">
          <Button
            asChild
            variant="ghost"
            className={cn(
              'h-14 flex-col gap-1 rounded-xl',
              isHome && 'text-primary'
            )}
            aria-current={isHome ? 'page' : undefined}
          >
            <Link to="/">
              <Home className="size-5" />
              <span className="text-xs">{t('components.bottomNav.home')}</span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              'h-14 flex-col gap-1 rounded-xl',
              isBaseList && 'text-primary'
            )}
            aria-current={isBaseList ? 'page' : undefined}
          >
            <Link to="/base-list">
              <ListChecks className="size-5" />
              <span className="text-xs">
                {t('components.bottomNav.baseLists')}
              </span>
            </Link>
          </Button>
          <Button
            variant="default"
            className="h-14 flex-col gap-1 rounded-xl bg-primary px-3 text-primary-foreground hover:bg-primary/90"
            onClick={openStartShoppingDialog}
            disabled={startShoppingPending}
          >
            <ShoppingCart className="size-5" />
            <span className="text-xs">{t('components.bottomNav.shop')}</span>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              'h-14 flex-col gap-1 rounded-xl',
              isCatalog && 'text-primary'
            )}
            aria-current={isCatalog ? 'page' : undefined}
          >
            <Link to="/catalog">
              <PackageSearch className="size-5" />
              <span className="text-xs">
                {t('components.bottomNav.catalog')}
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className={cn(
              'h-14 flex-col gap-1 rounded-xl',
              isProfile && 'text-primary'
            )}
            aria-current={isProfile ? 'page' : undefined}
          >
            <Link to="/profile">
              {avatarUrl ? (
                <Avatar className="size-5">
                  <AvatarImage
                    src={avatarUrl}
                    alt={t('components.bottomNav.profile')}
                  />
                  <AvatarFallback>
                    <CircleUserRound className="size-4" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <CircleUserRound className="size-5" />
              )}
              <span className="text-xs">
                {t('components.bottomNav.profile')}
              </span>
            </Link>
          </Button>
        </div>
      </nav>
      <StartShoppingDialog
        open={startShoppingDialogOpen}
        ongoingList={ongoingList}
        isLoading={ongoingListLoading}
        isPending={startShoppingPending}
        onOpenChange={setStartShoppingDialogOpen}
        onReviewList={reviewList}
        onAddProducts={addProducts}
        onStartShopping={() => {
          shop();
        }}
      />
    </>
  );
});

AppBottomNav.displayName = 'AppBottomNav';

export { AppBottomNav };
export type { TAppBottomNavProps };
