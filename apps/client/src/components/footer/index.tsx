import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = memo(() => {
  const { t } = useTranslation();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-6 text-center text-sm text-muted-foreground">
        <p>
          {t('components.footer.rights', {
            year: new Date().getFullYear()
          })}
        </p>
      </div>
    </footer>
  );
});

export { Footer };
