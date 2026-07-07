import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const statusChipVariants = cva(
  'inline-flex w-fit items-center justify-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-border/70 bg-card/70 text-foreground',
        muted: 'border-transparent bg-muted/70 text-muted-foreground',
        pending:
          'border-yellow-500/25 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
        success:
          'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300',
        skipped:
          'border-orange-500/25 bg-orange-500/10 text-orange-700 dark:text-orange-300',
        info: 'border-primary/20 bg-primary/10 text-primary',
        destructive: 'border-destructive/25 bg-destructive/10 text-destructive'
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base'
      }
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'sm'
    }
  }
);

type TStatusChipProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusChipVariants>;

const StatusChip = memo(
  ({ tone, size, className, ...props }: TStatusChipProps) => {
    return (
      <span
        className={cn(statusChipVariants({ tone, size }), className)}
        {...props}
      />
    );
  }
);

StatusChip.displayName = 'StatusChip';

export { StatusChip };
export type { TStatusChipProps };
