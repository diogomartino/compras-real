import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';
import {
  memo,
  useCallback,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode
} from 'react';

type TKebabMenuItem = {
  key: string;
  icon: ReactNode;
  label: ReactNode;
  onSelect: () => void;
  variant?: 'default' | 'destructive';
};

type TKebabMenuProps = {
  label: string;
  items: TKebabMenuItem[];
  disabled?: boolean;
  align?: 'start' | 'center' | 'end';
  triggerClassName?: string;
  contentClassName?: string;
};

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE_PX = 12;

const KebabMenu = memo(
  ({
    label,
    items,
    disabled,
    align = 'end',
    triggerClassName,
    contentClassName
  }: TKebabMenuProps) => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);
    const startRef = useRef({ x: 0, y: 0 });
    const longPressedRef = useRef(false);

    const clearTimer = useCallback(() => {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
    }, []);

    const onPointerDown = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        // Don't let a press on the button also arm a card-level long-press.
        event.stopPropagation();

        // Mouse uses click / right-click; only arm the hold timer for touch/pen.
        if (disabled || event.pointerType === 'mouse') {
          return;
        }

        longPressedRef.current = false;
        startRef.current = { x: event.clientX, y: event.clientY };
        clearTimer();
        timerRef.current = window.setTimeout(() => {
          longPressedRef.current = true;
          setOpen(true);
        }, LONG_PRESS_MS);
      },
      [clearTimer, disabled]
    );

    const onPointerMove = useCallback(
      (event: PointerEvent<HTMLButtonElement>) => {
        if (!timerRef.current) {
          return;
        }

        if (
          Math.abs(event.clientX - startRef.current.x) > MOVE_TOLERANCE_PX ||
          Math.abs(event.clientY - startRef.current.y) > MOVE_TOLERANCE_PX
        ) {
          clearTimer();
        }
      },
      [clearTimer]
    );

    const onContextMenu = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        // Keep the button's own menu separate from any card-level one.
        event.stopPropagation();

        if (disabled) {
          return;
        }

        // Right-click (desktop) / any native long-press callout → open ours.
        event.preventDefault();
        setOpen(true);
      },
      [disabled]
    );

    const onClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
      // A long-press already opened the menu; swallow the trailing click so it
      // doesn't toggle straight back closed.
      if (longPressedRef.current) {
        longPressedRef.current = false;
        event.preventDefault();
      }
    }, []);

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'touch-none rounded-full select-none',
              triggerClassName
            )}
            disabled={disabled}
            aria-label={label}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={clearTimer}
            onPointerCancel={clearTimer}
            onPointerLeave={clearTimer}
            onContextMenu={onContextMenu}
            onClick={onClick}
          >
            <MoreHorizontal className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className={cn('w-44 rounded-xl', contentClassName)}
        >
          {items.map((item) => (
            <DropdownMenuItem
              key={item.key}
              variant={item.variant}
              onSelect={item.onSelect}
            >
              {item.icon}
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

KebabMenu.displayName = 'KebabMenu';

export { KebabMenu };
export type { TKebabMenuItem, TKebabMenuProps };
