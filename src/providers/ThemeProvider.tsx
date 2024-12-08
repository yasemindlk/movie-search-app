'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const MUIProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const muiTheme = createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
      background: {
        default: theme === 'dark' ? '#121212' : '#f5f5f5',
        paper: theme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: theme === 'dark' ? '#ffffff' : '#000000',
        secondary: theme === 'dark' ? '#b3b3b3' : '#666666',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: theme === 'dark' 
              ? '0 4px 6px rgba(0, 0, 0, 0.4)' 
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  if (!mounted) {
    return null;
  }

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <MUIProvider>{children}</MUIProvider>
    </NextThemesProvider>
  );
} 