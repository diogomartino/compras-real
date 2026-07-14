import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const bottomActionBarVariants = cva(
  'z-40 border-t border-border bg-background/92 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/78 sm:rounded-2xl sm:border sm:shadow-lg sm:shadow-black/5',
  {
    variants: {
      position: {
        sticky:
          'sticky bottom-0 -mx-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:mx-0 sm:pb-3',
        fixed:
          'fixed inset-x-0 bottom-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:right-6 sm:left-auto sm:bottom-6 sm:w-[min(28rem,calc(100vw-3rem))] sm:pb-3',
        static: ''
      },
      layout: {
        single: 'grid grid-cols-1 gap-2',
        split: 'grid grid-cols-2 gap-2',
        auto: 'flex flex-col gap-2 sm:flex-row sm:justify-end'
      }
    },
    defaultVariants: {
      position: 'sticky',
      layout: 'split'
    }
  }
);

type TBottomActionBarProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof bottomActionBarVariants>;

const BottomActionBar = memo(
  ({ position, layout, className, ...props }: TBottomActionBarProps) => {
    return (
      <div
        className={cn(bottomActionBarVariants({ position, layout }), className)}
        {...props}
      />
    );
  }
);

BottomActionBar.displayName = 'BottomActionBar';

export { BottomActionBar };
export type { TBottomActionBarProps };
