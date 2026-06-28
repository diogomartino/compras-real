import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const headingVariants = cva('text-balance tracking-tight', {
  variants: {
    size: {
      display: 'text-4xl font-semibold leading-[1.05] sm:text-6xl',
      h1: 'text-3xl font-semibold leading-tight sm:text-5xl',
      h2: 'text-2xl font-semibold leading-tight sm:text-4xl',
      h3: 'text-xl font-semibold leading-snug sm:text-2xl',
      h4: 'text-lg font-semibold leading-snug'
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground'
    }
  },
  defaultVariants: {
    size: 'h2',
    tone: 'default'
  }
});

type THeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    level?: 1 | 2 | 3 | 4;
  };

const Heading = memo(
  ({ level = 2, size, tone, className, ...props }: THeadingProps) => {
    const Comp =
      level === 1 ? 'h1' : level === 2 ? 'h2' : level === 3 ? 'h3' : 'h4';

    return (
      <Comp
        className={cn(headingVariants({ size, tone }), className)}
        {...props}
      />
    );
  }
);

Heading.displayName = 'Heading';

export { Heading };
export type { THeadingProps };
