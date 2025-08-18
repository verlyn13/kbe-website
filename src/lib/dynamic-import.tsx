import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface DynamicImportOptions<P> {
  loading?: ComponentType;
  ssr?: boolean;
  suspense?: boolean;
}

/**
 * Wrapper for Next.js dynamic imports with consistent error handling
 */
export function createDynamicComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
  options: DynamicImportOptions<P> = {}
) {
  return dynamic(
    async () => {
      try {
        const mod = await importFn();
        return 'default' in mod ? mod : { default: mod };
      } catch (error) {
        console.error('Dynamic import failed:', error);
        // Return a fallback component
        return {
          default: () => (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              Failed to load component. Please refresh the page.
            </div>
          ),
        };
      }
    },
    {
      ssr: options.ssr ?? true,
      suspense: options.suspense ?? false,
      loading: options.loading,
    }
  );
}

/**
 * Preload a dynamic component (for critical components)
 */
export function preloadComponent(
  importFn: () => Promise<any>
) {
  // Trigger the import but don't wait for it
  importFn().catch(console.error);
}