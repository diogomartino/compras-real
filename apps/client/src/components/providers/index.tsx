import { store } from '@/features/store';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { DialogsProvider } from '../dialogs';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <DialogsProvider />
          {children}
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  );
};

export { Providers };
