import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CircleUserRound,
  Home,
  ListChecks,
  PackageSearch,
  ShoppingCart
} from 'lucide-react';
import { memo, useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import { toast } from 'sonner';

type TAppBottomNavProps = {
  onLists?: () => void;
};

const AppBottomNav = memo(({ onLists }: TAppBottomNavProps) => {
  const location = useLocation();

  const showComingSoon = useCallback((label: string) => {
    toast.info(`${label} is coming soon.`);
  }, []);

  const lists = useCallback(() => {
    if (onLists) {
      onLists();
      return;
    }

    showComingSoon('Lists');
  }, [onLists, showComingSoon]);

  const shop = useCallback(() => {
    showComingSoon('Shopping mode');
  }, [showComingSoon]);

  const profile = useCallback(() => {
    showComingSoon('Profile');
  }, [showComingSoon]);

  const isHome = location.pathname === '/';
  const isCatalog = location.pathname.startsWith('/catalog');

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
          variant="ghost"
          className="h-14 flex-col gap-1 rounded-2xl"
          onClick={lists}
        >
          <ListChecks className="size-5" />
          <span className="text-xs">Lists</span>
        </Button>
        <Button
          variant="ghost"
          className="h-14 flex-col gap-1 rounded-2xl"
          onClick={shop}
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
          variant="ghost"
          className="h-14 flex-col gap-1 rounded-2xl"
          onClick={profile}
        >
          <CircleUserRound className="size-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </nav>
  );
});

AppBottomNav.displayName = 'AppBottomNav';

export { AppBottomNav };
export type { TAppBottomNavProps };
