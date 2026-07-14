import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFullscreenScreen } from '@/features/app/hooks';
import type { TTrpcErrors } from '@/helpers/parse-trpc-errors';
import { ArrowLeft } from 'lucide-react';
import { memo, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TBaseListFormMode, TBaseListFormValues } from './types';

type TBaseListManagementFormProps = {
  formMode: TBaseListFormMode;
  values: TBaseListFormValues;
  errors: TTrpcErrors;
  isPending: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (
    field: keyof TBaseListFormValues,
    value: TBaseListFormValues[keyof TBaseListFormValues]
  ) => void;
};

const BaseListManagementForm = memo(
  ({
    formMode,
    values,
    errors,
    isPending,
    onCancel,
    onSubmit,
    onFieldChange
  }: TBaseListManagementFormProps) => {
    const { t } = useTranslation();
    useFullscreenScreen();
    const onNameChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('name', event.target.value);
      },
      [onFieldChange]
    );
    const onEnabledChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onFieldChange('isEnabled', event.target.checked);
      },
      [onFieldChange]
    );

    return (
      <main className="min-h-dvh bg-background text-foreground">
        <form
          className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-4 sm:px-6"
          onSubmit={onSubmit}
        >
          <Inline justify="between" wrap={false} className="mb-6 gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              <ArrowLeft className="size-4" />
              {t('baseList.back')}
            </Button>
            <Inline gap="sm" wrap={false}>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {formMode.type === 'create'
                  ? t('baseList.createList')
                  : t('baseList.saveList')}
              </Button>
            </Inline>
          </Inline>

          <Surface radius="xl" padding="lg">
            <Stack gap="lg">
              <Stack gap="sm">
                <Text weight="semibold">
                  {formMode.type === 'create'
                    ? t('baseList.createBaseList')
                    : t('baseList.editBaseList')}
                </Text>
                <Text size="sm" tone="muted">
                  {t('baseList.enabledDescription')}
                </Text>
              </Stack>

              {errors._general && (
                <Text tone="destructive" role="alert">
                  {errors._general}
                </Text>
              )}

              <label className="space-y-2">
                <Text as="span" size="sm" weight="medium">
                  {t('baseList.name')}
                </Text>
                <Input
                  value={values.name}
                  error={errors.name}
                  onChange={onNameChange}
                  placeholder={t('baseList.namePlaceholder')}
                />
              </label>

              <label className="flex items-center gap-3">
                <input
                  checked={values.isEnabled}
                  onChange={onEnabledChange}
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                />
                <Stack gap="none">
                  <Text as="span" size="sm" weight="medium">
                    {t('baseList.enabled')}
                  </Text>
                  <Text size="xs" tone="muted">
                    {t('baseList.includeEnabled')}
                  </Text>
                </Stack>
              </label>
            </Stack>
          </Surface>
        </form>
      </main>
    );
  }
);

BaseListManagementForm.displayName = 'BaseListManagementForm';

export { BaseListManagementForm };
