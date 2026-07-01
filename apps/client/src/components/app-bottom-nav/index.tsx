import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { requestConfirmation } from '@/features/dialogs/actions';
import { useAuth } from '@/features/auth/hooks';
import { parseTrpcErrors } from '@/helpers/parse-trpc-errors';
import { cn } from '@/lib/utils';
import { useStartShopping } from '@/mutations/shopping';
import {
  CircleUserRound,
  Home,
  ListChecks,
  PackageSearch,
  ShoppingCart
} from 'lucide-react';
import { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

type TAppBottomNavProps = Record<string, never>;

const AppBottomNav = memo(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const { avatarUrl } = useAuth();
  const { mutateAsync: startShopping, isPending: startShoppingPending } =
    useStartShopping();

  const shop = useCallback(() => {
    void (async () => {
      const confirmed = await requestConfirmation({
        title: 'Start shopping mode?',
        message:
          'Everyone in the household will see shopping mode until this shop is finished.',
        confirmLabel: 'Start shopping',
        cancelLabel: 'Cancel',
        variant: 'info'
      });

      if (!confirmed) {
        return;
      }

      try {
        await startShopping();
        navigate('/shop');
      } catch (error) {
        toast.error(
          parseTrpcErrors(error)._general ?? 'Failed to start shopping mode.'
        );
      }
    })();
  }, [navigate, startShopping]);

  const isHome = location.pathname === '/';
  const isBaseList = location.pathname.startsWith('/base-list');
  const isCatalog = location.pathname.startsWith('/catalog');
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/92 px-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:rounded-t-3xl sm:border-x">
      <div className="grid grid-cols-5 gap-1">
        <Button
          asChild
          variant="ghost"
          className={cn(
            'h-14 flex-col gap-1 rounded-2xl',
            isHome && 'text-primary'
          )}
          aria-current={isHome ? 'page' : undefined}
        >
          <Link to="/">
            <Home className="size-5" />
            <span className="text-xs">Home</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className={cn(
            'h-14 flex-col gap-1 rounded-2xl',
            isBaseList && 'text-primary'
          )}
          aria-current={isBaseList ? 'page' : undefined}
        >
          <Link to="/base-list">
            <ListChecks className="size-5" />
            <span className="text-xs">Base List</span>
          </Link>
        </Button>
        <Button
          variant="default"
          className="-mt-5 h-16 flex-col gap-1 rounded-3xl bg-primary px-3 text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
          onClick={shop}
          disabled={startShoppingPending}
        >
          <ShoppingCart className="size-5" />
          <span className="text-xs">Shop</span>
        </Button>
        <Button
          asChild
          variant="ghost"
          className={cn(
            'h-14 flex-col gap-1 rounded-2xl',
            isCatalog && 'text-primary'
          )}
          aria-current={isCatalog ? 'page' : undefined}
        >
          <Link to="/catalog">
            <PackageSearch className="size-5" />
            <span className="text-xs">Catalog</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className={cn(
            'h-14 flex-col gap-1 rounded-2xl',
            isProfile && 'text-primary'
          )}
          aria-current={isProfile ? 'page' : undefined}
        >
          <Link to="/profile">
            {avatarUrl ? (
              <Avatar className="size-5">
                <AvatarImage src={avatarUrl} alt="Profile" />
                <AvatarFallback>
                  <CircleUserRound className="size-4" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <CircleUserRound className="size-5" />
            )}
            <span className="text-xs">Profile</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
});

AppBottomNav.displayName = 'AppBottomNav';

export { AppBottomNav };
export type { TAppBottomNavProps };
