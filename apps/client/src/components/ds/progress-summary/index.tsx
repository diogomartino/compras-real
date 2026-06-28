import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { memo, type HTMLAttributes, type ReactNode } from 'react';
import { Inline } from '../inline';
import { Text } from '../text';

const progressSummaryVariants = cva('min-w-0 space-y-2', {
  variants: {
    size: {
      sm: '[--progress-height:0.375rem]',
      md: '[--progress-height:0.5rem]',
      lg: '[--progress-height:0.75rem]'
    },
    tone: {
      default: '[--progress-color:var(--primary)]',
      muted: '[--progress-color:var(--muted-foreground)]',
      success: '[--progress-color:oklch(0.58_0.14_145)]',
      warn: '[--progress-color:oklch(0.72_0.15_76)]'
    }
  },
  defaultVariants: {
    size: 'md',
    tone: 'default'
  }
});

type TProgressSummaryProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof progressSummaryVariants> & {
    label?: ReactNode;
    value?: ReactNode;
    progress: number;
  };

const ProgressSummary = memo(
  ({
    label,
    value,
    progress,
    size,
    tone,
    className,
    ...props
  }: TProgressSummaryProps) => {
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    return (
      <div
        className={cn(progressSummaryVariants({ size, tone }), className)}
        {...props}
      >
        {(label || value) && (
          <Inline justify="between" gap="sm" wrap={false}>
            {label && (
              <Text as="div" size="sm" tone="muted" weight="medium">
                {label}
              </Text>
            )}
            {value && (
              <Text as="div" size="sm" weight="semibold">
                {value}
              </Text>
            )}
          </Inline>
        )}
        <div
          className="h-[var(--progress-height)] overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={normalizedProgress}
        >
          <div
            className="h-full rounded-full bg-[var(--progress-color)] transition-all duration-300 ease-out"
            style={{ width: `${normalizedProgress}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressSummary.displayName = 'ProgressSummary';

export { ProgressSummary };
export type { TProgressSummaryProps };
