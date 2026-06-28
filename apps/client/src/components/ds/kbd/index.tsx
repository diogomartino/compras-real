import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const kbdVariants = cva(
  'inline-flex items-center justify-center rounded-md border border-border bg-muted font-mono font-medium text-muted-foreground shadow-xs',
  {
    variants: {
      size: {
        sm: 'h-5 min-w-5 px-1 text-[0.65rem]',
        md: 'h-6 min-w-6 px-1.5 text-xs',
        lg: 'h-7 min-w-7 px-2 text-sm'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
);

type TKbdProps = HTMLAttributes<HTMLElement> & VariantProps<typeof kbdVariants>;

const Kbd = memo(({ size, className, ...props }: TKbdProps) => {
  return <kbd className={cn(kbdVariants({ size }), className)} {...props} />;
});

Kbd.displayName = 'Kbd';

export { Kbd };
export type { TKbdProps };
