import { cn } from '@/lib/utils';
import { memo, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';

type TLinkProps = {
  href?: string;
  to?: string;
  className?: string;
  children: ReactNode;
  target?: string;
};

const Link = memo(({ href, to, className, children, target }: TLinkProps) => {
  const sharedClassName = cn(
    'text-white/90 underline transition-all active:saturate-50',
    className
  );

  if (href) {
    return (
      <a
        href={href}
        className={sharedClassName}
        target={target}
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <RouterLink to={to} className={sharedClassName}>
        {children}
      </RouterLink>
    );
  }

  return <span className={sharedClassName}>{children}</span>;
});

export { Link };
