import { memo } from 'react';
import Spinner from '../ui/spinner';

const AppLoading = memo(() => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <Spinner size="lg" />
    </div>
  );
});

export { AppLoading };
