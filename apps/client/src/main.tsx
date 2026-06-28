import { Toaster } from '@/components/ui/sonner';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/app/index.tsx';
import { Providers } from './components/providers/index.tsx';
import { ThemeProvider } from './components/theme-provider/index.tsx';
import { LocalStorageKey } from './helpers/storage.ts';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme="light"
      storageKey={LocalStorageKey.VITE_UI_THEME}
    >
      <Toaster />
      <Providers>
        <App />
      </Providers>
    </ThemeProvider>
  </StrictMode>
);
