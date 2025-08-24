import { type RenderOptions, render as rtlRender } from '@testing-library/react';
import type React from 'react';
import { ThemeProvider } from '@/providers/theme-provider';

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

function render(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
export { render };
