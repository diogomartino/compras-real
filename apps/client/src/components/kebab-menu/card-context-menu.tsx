import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import {
  memo,
  useCallback,
  useRef,
  type PointerEvent,
  type ReactElement
} from 'react';
import type { TKebabMenuItem } from './index';

type TCardContextMenuProps = {
  items: TKebabMenuItem[];
  children: ReactElement;
  contentClassName?: string;
};

const LONG_PRESS_MS = 450;
const MOVE_TOLERANCE_PX = 12;

const CardContextMenu = memo(
  ({ items, children, contentClassName }: TCardContextMenuProps) => {
    const timerRef = useRef(0);
    const elementRef = useRef<HTMLElement | null>(null);
    const startRef = useRef({ x: 0, y: 0 });

    const clear = useCallback(() => {
      window.clearTimeout(timerRef.current);
      timerRef.current = 0;
    }, []);

    const onPointerDown = useCallback(
      (event: PointerEvent<HTMLElement>) => {
        // Mouse uses right-click; only arm the hold timer for touch/pen.
        if (event.pointerType === 'mouse') {
          return;
        }

        const element = event.currentTarget;
        const { clientX, clientY } = event;

        startRef.current = { x: clientX, y: clientY };
        elementRef.current = element;
        clear();
        timerRef.current = window.setTimeout(() => {
          element.dispatchEvent(
            new MouseEvent('contextmenu', {
              bubbles: true,
              cancelable: true,
              clientX,
              clientY
            })
          );
        }, LONG_PRESS_MS);
      },
      [clear]
    );

    const onPointerMove = useCallback(
      (event: PointerEvent<HTMLElement>) => {
        if (!timerRef.current) {
          return;
        }

        if (
          Math.abs(event.clientX - startRef.current.x) > MOVE_TOLERANCE_PX ||
          Math.abs(event.clientY - startRef.current.y) > MOVE_TOLERANCE_PX
        ) {
          clear();
        }
      },
      [clear]
    );

    return (
      <ContextMenu>
        <ContextMenuTrigger
          asChild
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={clear}
          onPointerCancel={clear}
          onPointerLeave={clear}
        >
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className={cn('w-44 rounded-xl', contentClassName)}>
          {items.map((item) => (
            <ContextMenuItem
              key={item.key}
              variant={item.variant}
              onSelect={item.onSelect}
            >
              {item.icon}
              {item.label}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

CardContextMenu.displayName = 'CardContextMenu';

export { CardContextMenu };
export type { TCardContextMenuProps };
