import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes } from 'react';

const textVariants = cva('text-pretty', {
  variants: {
    size: {
      xs: 'text-xs leading-relaxed',
      sm: 'text-sm leading-relaxed',
      md: 'text-base leading-relaxed',
      lg: 'text-lg leading-relaxed'
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      subtle: 'text-muted-foreground/75',
      destructive: 'text-destructive'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold'
    }
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
    weight: 'normal'
  }
});

type TTextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textVariants> & {
    as?: 'p' | 'span' | 'div';
  };

const Text = memo(
  ({ as = 'p', size, tone, weight, className, ...props }: TTextProps) => {
    const Comp = as;

    return (
      <Comp
        className={cn(textVariants({ size, tone, weight }), className)}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

export { Text };
export type { TTextProps };
