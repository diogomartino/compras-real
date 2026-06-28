import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const surfaceVariants = cva('min-w-0', {
  variants: {
    variant: {
      default: 'border border-border bg-card text-card-foreground shadow-sm',
      muted: 'border border-border bg-muted/40 text-foreground',
      outline: 'border border-border bg-transparent text-foreground',
      elevated:
        'border border-border bg-card text-card-foreground shadow-lg shadow-black/5',
      ghost: 'bg-transparent text-foreground'
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    },
    radius: {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md',
    radius: 'xl'
  }
});

type TSurfaceProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof surfaceVariants>;

const Surface = memo(
  ({ variant, padding, radius, className, ...props }: TSurfaceProps) => {
    return (
      <div
        className={cn(surfaceVariants({ variant, padding, radius }), className)}
        {...props}
      />
    );
  }
);

Surface.displayName = 'Surface';

export { Surface };
export type { TSurfaceProps };
