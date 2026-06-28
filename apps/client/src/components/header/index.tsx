import { Dialog } from '@/components/dialogs/dialogs';
import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/actions';
import { useAuth, useIsAuthenticated } from '@/features/auth/hooks';
import { openDialog } from '@/features/dialogs/actions';
import { memo, useCallback } from 'react';
import { Link } from 'react-router';

const Header = memo(() => {
  const { email } = useAuth();
  const isAuthenticated = useIsAuthenticated();
  const onLogout = useCallback(() => {
    void logout();
  }, []);
  const openLogin = useCallback(() => {
    openDialog(Dialog.LOGIN);
  }, []);
  const openRegister = useCallback(() => {
    openDialog(Dialog.REGISTER);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">My App</h1>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                {email}
              </span>
              <Button variant="outline" onClick={onLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={openLogin}>
                Log in
              </Button>
              <Button onClick={openRegister}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export { Header };
