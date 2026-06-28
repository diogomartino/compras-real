import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Text } from '../text';

const statVariants = cva('min-w-0 rounded-2xl border p-4', {
  variants: {
    tone: {
      default: 'border-border bg-card text-card-foreground',
      muted: 'border-border bg-muted/40 text-foreground',
      success: 'border-green-500/20 bg-green-500/10 text-foreground',
      warn: 'border-yellow-500/20 bg-yellow-500/10 text-foreground',
      destructive: 'border-destructive/20 bg-destructive/10 text-foreground'
    }
  },
  defaultVariants: {
    tone: 'default'
  }
});

type TStatProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof statVariants> & {
    label: ReactNode;
    value: ReactNode;
    description?: ReactNode;
    trend?: ReactNode;
  };

const Stat = memo(
  ({
    label,
    value,
    description,
    trend,
    tone,
    className,
    ...props
  }: TStatProps) => {
    return (
      <div className={cn(statVariants({ tone }), className)} {...props}>
        <div className="flex items-start justify-between gap-3">
          <Text size="sm" tone="muted" weight="medium">
            {label}
          </Text>
          {trend && <div className="shrink-0 text-sm font-medium">{trend}</div>}
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight">
          {value}
        </div>
        {description && (
          <Text size="sm" tone="muted" className="mt-1">
            {description}
          </Text>
        )}
      </div>
    );
  }
);

Stat.displayName = 'Stat';

export { Stat };
export type { TStatProps };
