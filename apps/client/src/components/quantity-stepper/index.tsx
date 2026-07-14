import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatQuantity } from '@/screens/home/helpers';
import type { TUnitKind } from '@myapp/shared';
import { Minus, Plus } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Discrete units step by 1; weight/volume by a quarter.
const DISCRETE_UNITS: TUnitKind[] = ['unit', 'pack', 'box', 'bottle', 'other'];

const stepForUnit = (unit: TUnitKind) =>
  DISCRETE_UNITS.includes(unit) ? 1 : 0.25;

type TQuantityStepperProps = {
  amount: number;
  unit: TUnitKind;
  disabled?: boolean;
  onChange: (amount: number) => void;
  className?: string;
};

const QuantityStepper = memo(
  ({ amount, unit, disabled, onChange, className }: TQuantityStepperProps) => {
    const { t } = useTranslation();
    const [value, setValue] = useState(amount);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const step = stepForUnit(unit);

    // Reflect external changes (query refetch) when not mid-edit.
    useEffect(() => {
      setValue(amount);
    }, [amount]);

    const commit = useCallback(
      (next: number) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // Debounce so rapid taps fire a single mutation.
        timerRef.current = setTimeout(() => onChange(next), 500);
      },
      [onChange]
    );

    const adjust = useCallback(
      (direction: 1 | -1) => {
        setValue((current) => {
          const next = Math.max(
            step,
            Math.round((current + direction * step) * 1000) / 1000
          );

          commit(next);

          return next;
        });
      },
      [commit, step]
    );

    useEffect(
      () => () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      },
      []
    );

    return (
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/60 p-1',
          className
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          className="size-8 rounded-full"
          disabled={disabled || value <= step}
          onClick={() => adjust(-1)}
          aria-label={t('common.decrease')}
        >
          <Minus className="size-4" />
        </Button>
        <span className="min-w-16 text-center text-sm font-semibold tabular-nums">
          {formatQuantity(value, unit)}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          className="size-8 rounded-full"
          disabled={disabled}
          onClick={() => adjust(1)}
          aria-label={t('common.increase')}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    );
  }
);

QuantityStepper.displayName = 'QuantityStepper';

export { QuantityStepper };
export type { TQuantityStepperProps };
