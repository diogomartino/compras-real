import { Stack, Surface, Text } from '@/components/ds';
import { setAuthToken } from '@/features/auth/actions';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const AuthGoogleCallback = memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const searchParams = new URLSearchParams(window.location.search);
    const token = hashParams.get('token') ?? searchParams.get('token');
    const error = searchParams.get('error') ?? hashParams.get('error');

    if (token) {
      setAuthToken(token).then(() => navigate('/', { replace: true }));
      return;
    }

    navigate(error ? `/?authError=${encodeURIComponent(error)}` : '/', {
      replace: true
    });
  }, [navigate]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 text-foreground">
      <Surface
        radius="xl"
        padding="lg"
        className="w-full max-w-sm text-center"
      >
        <Stack gap="sm" align="center">
          <Text weight="semibold">{t('googleAuth.finishing')}</Text>
          <Text size="sm" tone="muted">
            {t('googleAuth.redirecting')}
          </Text>
        </Stack>
      </Surface>
    </main>
  );
});

AuthGoogleCallback.displayName = 'AuthGoogleCallback';

export { AuthGoogleCallback };
