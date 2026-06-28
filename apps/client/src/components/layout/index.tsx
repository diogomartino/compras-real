import { cn } from '@/lib/utils';
import { memo } from 'react';
import { Footer } from '../footer';
import { Header } from '../header';

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
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          {sidebar}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <main className={cn('flex-1 p-4', className)}>{content}</main>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
);

export { Layout };
