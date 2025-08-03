import { ErrorBoundary } from '@/components/error-boundary';
import { SkipNavigation } from '@/components/skip-navigation';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'KBE Website',
  description: 'Parent and student portal for Kachemak Bay Explorers.',
  manifest: '/manifest.json',
};

/**
 * Root layout component for the KBE Website application.
 * Provides global providers, styles, and error handling.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root layout wrapper
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-body min-h-screen antialiased`}>
        <SkipNavigation />
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
