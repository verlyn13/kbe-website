import { ReactNode } from 'react';
import { LegalFooter } from './legal-footer';

interface LayoutWithFooterProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function LayoutWithFooter({ children, showFooter = true }: LayoutWithFooterProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      {showFooter && <LegalFooter />}
    </div>
  );
}