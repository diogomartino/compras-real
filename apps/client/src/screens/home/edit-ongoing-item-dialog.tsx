import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from '@/hooks/use-form';
import type { TOngoingListEntry, TUnitKind } from '@myapp/shared';
import {
  memo,
  useCallback,
  useEffect,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { useTranslation } from 'react-i18next';
import { unitOptions } from './helpers';

type TEditOngoingItemForm = {
  quantityAmount: string;
  quantityUnit: TUnitKind;
};

type TEditOngoingItemDialogProps = {
  item?: TOngoingListEntry;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (input: {
    id: string;
    quantityAmount: number;
    quantityUnit: TUnitKind;
  }) => void;
};

const emptyForm: TEditOngoingItemForm = {
  quantityAmount: '1',
  quantityUnit: 'unit'
};

const EditOngoingItemDialog = memo(
  ({ item, isPending, onClose, onSubmit }: TEditOngoingItemDialogProps) => {
    const { t } = useTranslation();
    const { values, errors, onChange, setValues, setErrors, resetErrors } =
      useForm<TEditOngoingItemForm>(emptyForm);
    const open = !!item;

    useEffect(() => {
      if (item) {
        setValues({
          quantityAmount: String(item.quantityAmount),
          quantityUnit: item.quantityUnit
        });
        resetErrors();
      }
    }, [item, resetErrors, setValues]);

    const close = useCallback(() => {
      onClose();
      resetErrors();
    }, [onClose, resetErrors]);
    const onQuantityAmountChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        onChange('quantityAmount', event.target.value);
      },
      [onChange]
    );
    const onQuantityUnitChange = useCallback(
      (value: string) => {
        onChange('quantityUnit', value as TUnitKind);
      },
      [onChange]
    );
    const submit = useCallback(
      (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!item) {
          return;
        }

        const quantityAmount = Number(values.quantityAmount);

        if (!quantityAmount || quantityAmount <= 0) {
          setErrors({
            quantityAmount: t('home.editQuantity.quantityGreaterThanZero')
          });
          return;
        }

        onSubmit({
          id: item.id,
          quantityAmount,
          quantityUnit: values.quantityUnit
        });
      },
      [item, onSubmit, setErrors, t, values]
    );

    return (
      <Dialog open={open} onOpenChange={close}>
        <DialogContent className="rounded-3xl" close={close}>
          <form className="grid gap-4" onSubmit={submit}>
            <DialogHeader>
              <DialogTitle>{t('home.editQuantity.title')}</DialogTitle>
              <DialogDescription>{item?.title}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium">
                  {t('home.editQuantity.quantity')}
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.001"
                  value={values.quantityAmount}
                  error={errors.quantityAmount}
                  onChange={onQuantityAmountChange}
                  className="h-11 rounded-xl"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium">
                  {t('home.editQuantity.unit')}
                </span>
                <Select
                  value={values.quantityUnit}
                  onValueChange={onQuantityUnitChange}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl">
                    <SelectValue placeholder={t('home.editQuantity.selectUnit')} />
                  </SelectTrigger>
                  <SelectContent>
                    {unitOptions.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={close}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t('home.editQuantity.saveQuantity')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

EditOngoingItemDialog.displayName = 'EditOngoingItemDialog';

export { EditOngoingItemDialog };
