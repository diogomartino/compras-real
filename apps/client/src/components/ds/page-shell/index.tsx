import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Heading } from '../heading';
import { Text } from '../text';

const pageShellVariants = cva('mx-auto flex w-full min-w-0 flex-col', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      full: 'max-w-none'
    },
    spacing: {
      sm: 'gap-4 px-4 py-4',
      md: 'gap-6 px-4 py-6 sm:px-6',
      lg: 'gap-8 px-4 py-8 sm:px-6 lg:px-8'
    }
  },
  defaultVariants: {
    size: 'lg',
    spacing: 'md'
  }
});

type TPageShellProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof pageShellVariants> & {
    eyebrow?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
  };

const PageShell = memo(
  ({
    eyebrow,
    title,
    description,
    actions,
    size,
    spacing,
    className,
    children,
    ...props
  }: TPageShellProps) => {
    const hasHeader = eyebrow || title || description || actions;

    return (
      <div
        className={cn(pageShellVariants({ size, spacing }), className)}
        {...props}
      >
        {hasHeader && (
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 space-y-2">
              {eyebrow && (
                <Text
                  as="div"
                  size="xs"
                  tone="muted"
                  weight="semibold"
                  className="uppercase tracking-[0.24em]"
                >
                  {eyebrow}
                </Text>
              )}
              {title && (
                <Heading level={1} size="h1">
                  {title}
                </Heading>
              )}
              {description && (
                <Text tone="muted" className="max-w-2xl">
                  {description}
                </Text>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </header>
        )}
        {children}
      </div>
    );
  }
);

PageShell.displayName = 'PageShell';

export { PageShell };
export type { TPageShellProps };
