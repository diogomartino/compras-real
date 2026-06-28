import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Heading } from '../heading';
import { Text } from '../text';

const emptyStateVariants = cva(
  'flex min-w-0 flex-col items-center text-center',
  {
    variants: {
      variant: {
        default: 'rounded-2xl border border-border bg-card',
        muted: 'rounded-2xl border border-border bg-muted/40',
        plain: 'bg-transparent'
      },
      size: {
        sm: 'gap-3 p-4',
        md: 'gap-4 p-6',
        lg: 'gap-5 p-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

type TEmptyStateProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof emptyStateVariants> & {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    actions?: ReactNode;
  };

const EmptyState = memo(
  ({
    icon,
    title,
    description,
    actionLabel,
    onAction,
    actions,
    variant,
    size,
    className,
    ...props
  }: TEmptyStateProps) => {
    return (
      <div
        className={cn(emptyStateVariants({ variant, size }), className)}
        {...props}
      >
        {icon && (
          <div className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <Heading level={3} size="h4">
            {title}
          </Heading>
          {description && (
            <Text size="sm" tone="muted" className="max-w-md">
              {description}
            </Text>
          )}
        </div>
        {actions}
        {actionLabel && (
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };
export type { TEmptyStateProps };
