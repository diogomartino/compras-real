import { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
});

export { Footer };
