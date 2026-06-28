import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Text } from '../text';

const listRowVariants = cva(
  'grid min-w-0 items-center border transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-card',
        muted: 'border-border bg-muted/40',
        ghost: 'border-transparent bg-transparent',
        selected: 'border-primary/30 bg-primary/10'
      },
      size: {
        sm: 'grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-xl p-3',
        md: 'grid-cols-[auto_minmax(0,1fr)_auto] gap-3 rounded-2xl p-4',
        lg: 'grid-cols-[auto_minmax(0,1fr)_auto] gap-4 rounded-2xl p-5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

type TListRowProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof listRowVariants> & {
    leading?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    trailing?: ReactNode;
    actions?: ReactNode;
  };

const ListRow = memo(
  ({
    leading,
    title,
    description,
    meta,
    trailing,
    actions,
    variant,
    size,
    className,
    ...props
  }: TListRowProps) => {
    return (
      <div
        className={cn(
          listRowVariants({ variant, size }),
          !leading && !trailing && 'grid-cols-1',
          !leading && trailing && 'grid-cols-[minmax(0,1fr)_auto]',
          leading && !trailing && 'grid-cols-[auto_minmax(0,1fr)]',
          className
        )}
        {...props}
      >
        {leading && <div className="min-w-0">{leading}</div>}
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <Text as="div" weight="semibold" className="truncate leading-tight">
              {title}
            </Text>
            {meta && <div className="shrink-0">{meta}</div>}
          </div>
          {description && (
            <Text size="sm" tone="muted" className="line-clamp-2">
              {description}
            </Text>
          )}
          {actions && <div className="pt-1">{actions}</div>}
        </div>
        {trailing && <div className="min-w-0 justify-self-end">{trailing}</div>}
      </div>
    );
  }
);

ListRow.displayName = 'ListRow';

export { ListRow };
export type { TListRowProps };
