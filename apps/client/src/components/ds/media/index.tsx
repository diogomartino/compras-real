import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ImageIcon } from 'lucide-react';
import { memo, type HTMLAttributes, type ReactNode } from 'react';

const mediaVariants = cva(
  'relative shrink-0 overflow-hidden border border-border bg-muted text-muted-foreground',
  {
    variants: {
      size: {
        xs: 'size-8',
        sm: 'size-10',
        md: 'size-14',
        lg: 'size-20',
        xl: 'size-28'
      },
      shape: {
        square: 'rounded-xl',
        circle: 'rounded-full',
        soft: 'rounded-2xl'
      }
    },
    defaultVariants: {
      size: 'md',
      shape: 'soft'
    }
  }
);

type TMediaProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof mediaVariants> & {
    src?: string | null;
    alt?: string;
    fallback?: ReactNode;
  };

const Media = memo(
  ({
    src,
    alt = '',
    fallback,
    size,
    shape,
    className,
    ...props
  }: TMediaProps) => {
    return (
      <div className={cn(mediaVariants({ size, shape }), className)} {...props}>
        {src ? (
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center bg-linear-to-br from-muted to-accent/30">
            {fallback ?? <ImageIcon className="size-5" />}
          </div>
        )}
      </div>
    );
  }
);

Media.displayName = 'Media';

export { Media };
export type { TMediaProps };
