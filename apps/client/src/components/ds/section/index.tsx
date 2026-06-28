import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Heading } from '../heading';
import { Text } from '../text';

const sectionVariants = cva('min-w-0', {
  variants: {
    variant: {
      default: 'bg-transparent',
      muted: 'rounded-2xl bg-muted/30',
      bordered: 'rounded-2xl border border-border bg-card/40'
    },
    spacing: {
      sm: 'space-y-3 p-3',
      md: 'space-y-4 p-4',
      lg: 'space-y-6 p-6'
    }
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'md'
  }
});

type TSectionProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants> & {
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
  };

const Section = memo(
  ({
    title,
    description,
    actions,
    variant,
    spacing,
    className,
    children,
    ...props
  }: TSectionProps) => {
    const hasHeader = title || description || actions;

    return (
      <section
        className={cn(sectionVariants({ variant, spacing }), className)}
        {...props}
      >
        {hasHeader && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              {title && (
                <Heading level={2} size="h3">
                  {title}
                </Heading>
              )}
              {description && (
                <Text size="sm" tone="muted">
                  {description}
                </Text>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export { Section };
export type { TSectionProps };
