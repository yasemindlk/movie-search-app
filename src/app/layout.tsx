import { Providers } from './providers';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Movie App',
  description: 'Movie search application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div style={{ 
            position: 'fixed', 
            top: '20px', 
            right: '20px', 
            zIndex: 1000 
          }}>
            <ThemeToggle />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}