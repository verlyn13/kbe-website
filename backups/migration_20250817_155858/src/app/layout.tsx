import { ErrorBoundary } from '@/components/error-boundary';
import { SkipNavigation } from '@/components/skip-navigation';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { ThemeProvider } from '@/providers/theme-provider';
import { LayoutWithFooter } from '@/components/layout-with-footer';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Homer Enrichment Hub',
  description: 'Your Gateway to MathCounts & Enrichment Programs in Homer.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
};

/**
 * Root layout component for the Homer Enrichment Hub application.
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
          <ThemeProvider defaultTheme="compass-peak">
            <AuthProvider>
              <LayoutWithFooter>{children}</LayoutWithFooter>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
