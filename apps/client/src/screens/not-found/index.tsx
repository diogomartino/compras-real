import { Button } from '@/components/ui/button';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

const NotFound = memo(() => {
  const { t } = useTranslation();

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 text-center text-foreground">
      <div className="w-full max-w-sm space-y-4 rounded-xl border border-border/70 bg-card/70 p-6">
        <p className="text-lg font-semibold">{t('notFound.title')}</p>
        <Button asChild className="w-full">
          <Link to="/">{t('common.back')}</Link>
        </Button>
      </div>
    </main>
  );
});

export { NotFound };
