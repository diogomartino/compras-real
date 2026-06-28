import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';

const toolbarVariants = cva('flex min-w-0 flex-col gap-3', {
  variants: {
    variant: {
      default: 'rounded-2xl border border-border bg-card p-3',
      muted: 'rounded-2xl border border-border bg-muted/40 p-3',
      plain: ''
    },
    align: {
      start: 'sm:items-start',
      center: 'sm:items-center',
      end: 'sm:items-end'
    }
  },
  defaultVariants: {
    variant: 'default',
    align: 'center'
  }
});

type TToolbarProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof toolbarVariants> & {
    search?: ReactNode;
    filters?: ReactNode;
    actions?: ReactNode;
  };

const Toolbar = memo(
  ({
    search,
    filters,
    actions,
    variant,
    align,
    className,
    children,
    ...props
  }: TToolbarProps) => {
    return (
      <div
        className={cn(toolbarVariants({ variant, align }), className)}
        {...props}
      >
        {(search || filters || actions) && (
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            {search && <div className="min-w-0 flex-1">{search}</div>}
            {filters && (
              <div className="flex min-w-0 flex-wrap gap-2">{filters}</div>
            )}
            {actions && (
              <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);

Toolbar.displayName = 'Toolbar';

export { Toolbar };
export type { TToolbarProps };
