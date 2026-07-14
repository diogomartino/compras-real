import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronRight } from 'lucide-react';
import { memo, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Text } from '../text';

const actionTileVariants = cva(
  'group flex min-h-24 w-full select-none items-center gap-4 rounded-2xl border text-left transition-all duration-150 active:scale-[0.98] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100',
  {
    variants: {
      variant: {
        default: 'border-border bg-card hover:bg-accent/50 active:bg-accent/70',
        muted: 'border-border bg-muted/45 hover:bg-muted active:bg-muted',
        primary:
          'border-primary/30 bg-primary/10 hover:bg-primary/15 active:bg-primary/20',
        outline:
          'border-border bg-transparent hover:bg-accent/50 active:bg-accent/70'
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

type TActionTileProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof actionTileVariants> & {
    icon?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
  };

const ActionTile = memo(
  ({
    icon,
    title,
    description,
    meta,
    variant,
    size,
    className,
    ...props
  }: TActionTileProps) => {
    return (
      <button
        className={cn(actionTileVariants({ variant, size }), className)}
        type="button"
        {...props}
      >
        {icon && (
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-background text-primary shadow-xs">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-1">
          <Text as="div" weight="semibold" className="leading-tight">
            {title}
          </Text>
          {description && (
            <Text size="sm" tone="muted" className="line-clamp-2">
              {description}
            </Text>
          )}
          {meta && <div className="pt-1">{meta}</div>}
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>
    );
  }
);

ActionTile.displayName = 'ActionTile';

export { ActionTile };
export type { TActionTileProps };
