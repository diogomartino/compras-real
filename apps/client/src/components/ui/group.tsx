import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';
import { memo } from 'react';
import { Label } from './label';
import { Tooltip } from './tooltip';

type TGroupProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  bottomDescription?: string;
  help?: React.ReactNode;
};

const Group = memo(
  ({
    label,
    children,
    description,
    bottomDescription,
    help,
    className
  }: TGroupProps) => {
    let helpComponent = null;

    if (help) {
      helpComponent = (
        <Tooltip content={help}>
          <HelpCircle className="ml-1 inline-block h-3 w-3 text-muted-foreground" />
        </Tooltip>
      );
    }

    return (
      <div className={cn('flex flex-col', className)}>
        <div className="flex flex-col mb-2">
          <div className="flex">
            <Label>{label}</Label>
            {helpComponent}
          </div>
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">{children}</div>
        {bottomDescription && (
          <span className="text-xs text-muted-foreground mt-2">
            {bottomDescription}
          </span>
        )}
      </div>
    );
  }
);

Group.displayName = 'Group';

export { Group };
