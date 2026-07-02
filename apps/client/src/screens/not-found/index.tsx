import { Layout } from '@/components/layout';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = memo(() => {
  const { t } = useTranslation();

  return <Layout>{t('notFound.title')}</Layout>;
});

export { NotFound };
