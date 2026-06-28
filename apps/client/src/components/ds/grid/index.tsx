import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const gridVariants = cva('grid min-w-0', {
  variants: {
    columns: {
      one: 'grid-cols-1',
      two: 'grid-cols-1 sm:grid-cols-2',
      three: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      four: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      auto: 'grid-cols-[repeat(auto-fit,minmax(min(14rem,100%),1fr))]'
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    }
  },
  defaultVariants: {
    columns: 'auto',
    gap: 'md'
  }
});

type TGridProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof gridVariants>;

const Grid = memo(({ columns, gap, className, ...props }: TGridProps) => {
  return (
    <div className={cn(gridVariants({ columns, gap }), className)} {...props} />
  );
});

Grid.displayName = 'Grid';

export { Grid };
export type { TGridProps };
