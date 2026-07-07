import { cn } from '@/lib/utils';
import { memo } from 'react';

type TLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  sidebar?: React.ReactNode;
  className?: string;
};

const Layout = memo(
  ({ children, container, sidebar, className }: TLayoutProps) => {
    let content = children;

    if (container) {
      content = (
        <div className="mx-auto w-full max-w-[96rem] space-y-4 px-0">
          {children}
        </div>
      );
    }

    return (
      <div className="min-h-dvh bg-background text-foreground">
        <div className="flex min-h-dvh">
          {sidebar}
          <main className={cn('min-w-0 flex-1 p-4', className)}>
            {content}
          </main>
        </div>
      </div>
    );
  }
);

export { Layout };
