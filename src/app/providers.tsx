'use client';

import { ThemeProvider } from '@/providers/ThemeProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
} 