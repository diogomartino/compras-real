import { Button } from '@/components/ui/button';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type TGoogleAuthButtonProps = {
  children: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const GoogleAuthButton = memo(({ children }: TGoogleAuthButtonProps) => {
  const loginWithGoogle = useCallback(() => {
    window.location.href = `${API_URL}/auth/google`;
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      className="h-12 w-full rounded-xl"
      onClick={loginWithGoogle}
    >
      {children}
    </Button>
  );
});

GoogleAuthButton.displayName = 'GoogleAuthButton';

const GoogleAuthSeparator = memo(() => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
      <div className="h-px flex-1 bg-border" />
      <span>{t('components.authDialogs.or')}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
});

GoogleAuthSeparator.displayName = 'GoogleAuthSeparator';

export { GoogleAuthButton, GoogleAuthSeparator };
export type { TGoogleAuthButtonProps };
