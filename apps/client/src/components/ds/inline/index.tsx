import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const inlineVariants = cva('flex min-w-0', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap'
    }
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'start',
    wrap: true
  }
});

type TInlineProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inlineVariants>;

const Inline = memo(
  ({ gap, align, justify, wrap, className, ...props }: TInlineProps) => {
    return (
      <div
        className={cn(inlineVariants({ gap, align, justify, wrap }), className)}
        {...props}
      />
    );
  }
);

Inline.displayName = 'Inline';

export { Inline };
export type { TInlineProps };
