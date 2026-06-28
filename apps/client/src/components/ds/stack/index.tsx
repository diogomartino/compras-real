import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const stackVariants = cva('flex min-w-0 flex-col', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
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
    }
  },
  defaultVariants: {
    gap: 'md',
    align: 'stretch',
    justify: 'start'
  }
});

type TStackProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof stackVariants>;

const Stack = memo(
  ({ gap, align, justify, className, ...props }: TStackProps) => {
    return (
      <div
        className={cn(stackVariants({ gap, align, justify }), className)}
        {...props}
      />
    );
  }
);

Stack.displayName = 'Stack';

export { Stack };
export type { TStackProps };
