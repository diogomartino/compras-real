import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ImageIcon } from 'lucide-react';
import {
  memo,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode
} from 'react';

const mediaVariants = cva(
  'relative shrink-0 overflow-hidden border border-border/70 bg-muted text-muted-foreground',
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
        soft: 'rounded-xl'
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
    const [imageFailed, setImageFailed] = useState(false);
    const initials = useMemo(() => {
      const words = alt.trim().split(/\s+/).filter(Boolean);

      if (words.length === 0) {
        return undefined;
      }

      return words
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('');
    }, [alt]);

    useEffect(() => {
      setImageFailed(false);
    }, [src]);

    return (
      <div className={cn(mediaVariants({ size, shape }), className)} {...props}>
        {src && !imageFailed ? (
          <img
            src={src}
            alt={alt}
            className="size-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="grid size-full place-items-center bg-muted">
            {fallback ??
              (initials ? (
                <span className="text-sm font-semibold tracking-tight text-primary/80">
                  {initials}
                </span>
              ) : (
                <ImageIcon className="size-5" />
              ))}
          </div>
        )}
      </div>
    );
  }
);

Media.displayName = 'Media';

export { Media };
export type { TMediaProps };
