import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Text } from '../text';

const fieldVariants = cva('min-w-0', {
  variants: {
    layout: {
      stack: 'space-y-2',
      inline:
        'grid gap-2 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] sm:items-start'
    }
  },
  defaultVariants: {
    layout: 'stack'
  }
});

type TFieldProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof fieldVariants> & {
    label: ReactNode;
    description?: ReactNode;
    error?: ReactNode;
    required?: boolean;
  };

const Field = memo(
  ({
    label,
    description,
    error,
    required,
    layout,
    className,
    children,
    ...props
  }: TFieldProps) => {
    return (
      <div className={cn(fieldVariants({ layout }), className)} {...props}>
        <div className="min-w-0 space-y-1">
          <Label className="cursor-default">
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
          {description && (
            <Text size="sm" tone="muted">
              {description}
            </Text>
          )}
        </div>
        <div className="min-w-0 space-y-1.5">
          {children}
          {error && (
            <Text size="sm" tone="destructive" role="alert">
              {error}
            </Text>
          )}
        </div>
      </div>
    );
  }
);

Field.displayName = 'Field';

export { Field };
export type { TFieldProps };
