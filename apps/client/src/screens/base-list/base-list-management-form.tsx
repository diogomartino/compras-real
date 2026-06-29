import { Inline, Stack, Surface, Text } from '@/components/ds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TTrpcErrors } from '@/helpers/parse-trpc-errors';
import { ArrowLeft } from 'lucide-react';
import { memo, useCallback, type ChangeEvent, type FormEvent } from 'react';
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
          className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-4 sm:px-6 lg:px-8"
          onSubmit={onSubmit}
        >
          <Inline justify="between" wrap={false} className="mb-6 gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <Inline gap="sm" wrap={false}>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {formMode.type === 'create' ? 'Create list' : 'Save list'}
              </Button>
            </Inline>
          </Inline>

          <Surface radius="2xl" padding="lg">
            <Stack gap="lg">
              <Stack gap="sm">
                <Text weight="semibold">
                  {formMode.type === 'create'
                    ? 'Create Base List'
                    : 'Edit Base List'}
                </Text>
                <Text size="sm" tone="muted">
                  Enabled lists are included when a shopping session starts.
                </Text>
              </Stack>

              {errors._general && (
                <Text tone="destructive" role="alert">
                  {errors._general}
                </Text>
              )}

              <label className="space-y-2">
                <Text as="span" size="sm" weight="medium">
                  Name
                </Text>
                <Input
                  value={values.name}
                  error={errors.name}
                  onChange={onNameChange}
                  className="h-11 rounded-xl"
                  placeholder="Weekly basics"
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
                    Enabled
                  </Text>
                  <Text size="xs" tone="muted">
                    Include this list in future shopping sessions.
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
